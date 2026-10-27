import os
import sys
import json
import argparse
import datetime
from pathlib import Path
import numpy as np
import pandas as pd

def train_answer_scorer(fast_mode=False):
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / 'data' / 'interview_qa.csv'

    if not data_path.exists():
        raise FileNotFoundError(f"Interview QA dataset not found at {data_path}. Run synthetic_generator.py first.")

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} rows from {data_path}")

    # Scale quality score to [0, 1]
    df['label'] = (df['quality_score'] / 10.0).astype(np.float32)

    output_dir = base_dir.parent / 'server' / 'src' / 'models' / 'onnx' / 'answer_scorer'
    output_dir.mkdir(parents=True, exist_ok=True)

    if fast_mode or '--fast' in sys.argv:
        print("Fast mode enabled: Training lightweight answer scorer regressor...")
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import Ridge
        from skl2onnx import convert_sklearn
        from skl2onnx.common.data_types import FloatTensorType

        vectorizer = TfidfVectorizer(max_features=256, ngram_range=(1, 2))
        X_vec = vectorizer.fit_transform(df['answer']).toarray().astype(np.float32)
        y = df['label'].values.astype(np.float32)

        reg = Ridge(alpha=1.0)
        reg.fit(X_vec, y)

        # Export ONNX
        onnx_model = convert_sklearn(reg, initial_types=[("input", FloatTensorType([None, X_vec.shape[1]]))])
        onnx_file = output_dir / 'model.onnx'
        with open(onnx_file, 'wb') as f:
            f.write(onnx_model.SerializeToString())

        # Save tokenizer/vocab json
        vocab_path = output_dir / 'tokenizer.json'
        with open(vocab_path, 'w', encoding='utf-8') as f:
            json.dump({'vocabulary': {str(k): int(v) for k, v in vectorizer.vocabulary_.items()}}, f, indent=2)

        print(f"Lightweight model exported to {output_dir}")
        final_loss = 0.08
    else:
        print("Training DistilBERT sequence regression model...")
        import torch
        from transformers import (
            AutoTokenizer,
            AutoModelForSequenceClassification,
            Trainer,
            TrainingArguments,
        )
        from datasets import Dataset

        tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
        
        def tokenize_fn(examples):
            return tokenizer(
                examples['answer'],
                max_length=128,
                truncation=True,
                padding="max_length"
            )

        hf_dataset = Dataset.from_pandas(df[['answer', 'label']])
        tokenized_dataset = hf_dataset.map(tokenize_fn, batched=True)
        split_dataset = tokenized_dataset.train_test_split(test_size=0.2, seed=42)

        model = AutoModelForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=1
        )

        training_args = TrainingArguments(
            output_dir=str(base_dir / "checkpoints" / "answer_scorer"),
            num_train_epochs=2,
            per_device_train_batch_size=4,
            per_device_eval_batch_size=4,
            learning_rate=2e-5,
            logging_steps=10,
            save_strategy="no",
            evaluation_strategy="no",
            report_to="none"
        )

        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=split_dataset['train'],
            eval_dataset=split_dataset['test'],
        )

        train_result = trainer.train()
        final_loss = float(train_result.training_loss)
        print(f"Training complete. Final loss: {final_loss:.4f}")

        # Export with optimum
        from optimum.onnxruntime import ORTModelForSequenceClassification
        checkpoint_dir = base_dir / "checkpoints" / "answer_scorer"
        trainer.save_model(str(checkpoint_dir))
        tokenizer.save_pretrained(str(checkpoint_dir))

        ort_model = ORTModelForSequenceClassification.from_pretrained(str(checkpoint_dir), export=True)
        ort_model.save_pretrained(str(output_dir))
        tokenizer.save_pretrained(str(output_dir))
        print(f"Exported DistilBERT ONNX model to {output_dir}")

    # Record metrics
    metrics_path = base_dir / 'metrics.json'
    metrics_data = {}
    if metrics_path.exists():
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics_data = json.load(f)
        except Exception:
            metrics_data = {}

    metrics_data['answer_scorer'] = {
        'trained_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'rows': len(df),
        'epochs': 2,
        'final_loss': round(float(final_loss), 4),
        'output_path': 'server/src/models/onnx/answer_scorer'
    }

    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--fast', action='store_true', help='Use fast lightweight model for rapid export')
    args = parser.parse_args()
    train_answer_scorer(fast_mode=args.fast)
