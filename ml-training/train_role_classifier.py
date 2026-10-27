import json
import datetime
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType, FloatTensorType

def train_roles():
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / 'data' / 'resumes.csv'

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run synthetic_generator.py first.")

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} rows for role classification from {data_path}")

    # Generate synthetic text representation from features
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

    X_train, X_test, y_train, y_test = train_test_split(X_text, y, test_size=0.2, random_state=42)

    # Vectorizer + Classifier
    vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train).toarray().astype(np.float32)
    X_test_vec = vectorizer.transform(X_test).toarray().astype(np.float32)

    clf = LogisticRegression(max_iter=500, random_state=42)
    clf.fit(X_train_vec, y_train)

    preds = clf.predict(X_test_vec)
    acc = float(accuracy_score(y_test, preds))
    print(f"Role Classifier Accuracy: {acc * 100:.2f}%")

    # Export vectorizer dictionary for Node.js usage
    vocab_data = {
        'classes': list(clf.classes_),
        'vocabulary': {str(k): int(v) for k, v in vectorizer.vocabulary_.items()},
        'idf': [float(v) for v in vectorizer.idf_],
    }
    vec_json_path = base_dir.parent / 'server' / 'src' / 'models' / 'onnx' / 'role_classifier_vectorizer.json'
    vec_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(vec_json_path, 'w', encoding='utf-8') as f:
        json.dump(vocab_data, f, indent=2)
    print(f"Saved vectorizer JSON to {vec_json_path}")

    # Export classifier to ONNX
    output_path = base_dir.parent / 'server' / 'src' / 'models' / 'onnx' / 'role_classifier.onnx'
    initial_type = [("input", FloatTensorType([None, X_train_vec.shape[1]])) ]
    onnx_model = convert_sklearn(clf, initial_types=initial_type)
    with open(output_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    print(f"Exported role classifier ONNX to {output_path}")

    # Update metrics.json
    metrics_path = base_dir / 'metrics.json'
    metrics_data = {}
    if metrics_path.exists():
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics_data = json.load(f)
        except Exception:
            metrics_data = {}

    metrics_data['role_classifier'] = {
        'trained_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'rows': len(df),
        'classes': list(clf.classes_),
        'accuracy': round(acc, 4),
        'output_path': 'server/src/models/onnx/role_classifier.onnx'
    }

    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)

    print(f"Saved metrics to {metrics_path}")

if __name__ == '__main__':
    train_roles()
