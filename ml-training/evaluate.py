import json
import datetime
from pathlib import Path
import numpy as np
import pandas as pd
import onnxruntime as ort
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score

def evaluate():
    base_dir = Path(__file__).resolve().parent
    models_dir = base_dir.parent / 'server' / 'src' / 'models' / 'onnx'
    resumes_path = base_dir / 'data' / 'resumes.csv'

    if not resumes_path.exists():
        print(f"Data file not found at {resumes_path}")
        return

    df = pd.read_csv(resumes_path)

    results = []

    # 1. Evaluate ats_model.onnx
    ats_model_path = models_dir / 'ats_model.onnx'
    if ats_model_path.exists():
        feature_cols = [
            'word_count', 'section_count', 'skill_count', 'action_verb_count',
            'quantified_count', 'has_contact', 'has_projects', 'has_experience', 'skill_density'
        ]
        X = df[feature_cols].values.astype(np.float32)
        y = df['ats_score'].values.astype(np.float32)

        _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        eval_indices = np.random.RandomState(42).choice(len(X_test), size=min(100, len(X_test)), replace=False)
        X_sample = X_test[eval_indices]
        y_sample = y_test[eval_indices]

        session = ort.InferenceSession(str(ats_model_path))
        input_name = session.get_inputs()[0].name
        raw_preds = session.run(None, {input_name: X_sample})[0]
        preds = np.squeeze(raw_preds)
        mae = float(mean_absolute_error(y_sample, preds))

        results.append({
            'Model': 'ATS Score Regressor',
            'File': 'ats_model.onnx',
            'Samples': len(X_sample),
            'Metric': 'MAE',
            'Score': f"{mae:.3f} points"
        })
    else:
        print(f"ats_model.onnx not found at {ats_model_path}")

    # 2. Evaluate role_classifier.onnx
    role_model_path = models_dir / 'role_classifier.onnx'
    vec_json_path = models_dir / 'role_classifier_vectorizer.json'
    if role_model_path.exists() and vec_json_path.exists():
        with open(vec_json_path, 'r', encoding='utf-8') as f:
            vec_info = json.load(f)

        vocab = vec_info['vocabulary']
        classes = vec_info['classes']

        text_features = []
        for _, row in df.iterrows():
            txt = (
                f"word_count_{row['word_count']} "
                f"sections_{row['section_count']} "
                f"skills_{row['skill_count']} "
                f"verbs_{row['action_verb_count']} "
                f"quantified_{row['quantified_count']} "
                f"contact_{row['has_contact']} "
                f"projects_{row['has_projects']} "
                f"experience_{row['has_experience']} "
                f"density_{int(row['skill_density'])}"
            )
            text_features.append(txt)

        X_text = np.array(text_features)
        y = df['role_label'].values

        _, X_test_txt, _, y_test = train_test_split(X_text, y, test_size=0.2, random_state=42)
        eval_indices = np.random.RandomState(42).choice(len(X_test_txt), size=min(100, len(X_test_txt)), replace=False)
        X_sample_txt = X_test_txt[eval_indices]
        y_sample = y_test[eval_indices]

        # Tokenize with saved vocab
        X_sample_vec = np.zeros((len(X_sample_txt), len(vocab)), dtype=np.float32)
        for i, text in enumerate(X_sample_txt):
            tokens = text.lower().split()
            for t in tokens:
                if t in vocab:
                    idx = vocab[t]
                    X_sample_vec[i, idx] += 1.0

        session = ort.InferenceSession(str(role_model_path))
        input_name = session.get_inputs()[0].name
        out = session.run(None, {input_name: X_sample_vec})
        pred_labels = out[0]
        acc = float(accuracy_score(y_sample, pred_labels))

        results.append({
            'Model': 'Role Classifier',
            'File': 'role_classifier.onnx',
            'Samples': len(X_sample_txt),
            'Metric': 'Accuracy',
            'Score': f"{acc * 100:.2f}%"
        })

    # Print formatted table
    print("\n" + "=" * 65)
    print("           ML TRAINING LAB — ONNX MODEL EVALUATION            ")
    print("=" * 65)
    print(f"{'Model':<24} | {'File':<22} | {'Metric':<10} | {'Score'}")
    print("-" * 65)
    for r in results:
        print(f"{r['Model']:<24} | {r['File']:<22} | {r['Metric']:<10} | {r['Score']}")
    print("=" * 65 + "\n")

    # Update metrics.json
    metrics_path = base_dir / 'metrics.json'
    metrics_data = {}
    if metrics_path.exists():
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics_data = json.load(f)
        except Exception:
            metrics_data = {}

    metrics_data['evaluation'] = {
        'evaluated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'results': results
    }

    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)

if __name__ == '__main__':
    evaluate()
