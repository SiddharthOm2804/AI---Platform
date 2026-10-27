import json
import datetime
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from export_onnx import export_to_onnx

def train_ats():
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / 'data' / 'resumes.csv'
    
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run synthetic_generator.py first.")

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} resume rows from {data_path}")

    feature_cols = [
        'word_count',
        'section_count',
        'skill_count',
        'action_verb_count',
        'quantified_count',
        'has_contact',
        'has_projects',
        'has_experience',
        'skill_density'
    ]

    X = df[feature_cols].values.astype(np.float32)
    y = df['ats_score'].values.astype(np.float32)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training GradientBoostingRegressor...")
    model = GradientBoostingRegressor(
        n_estimators=250,
        max_depth=4,
        learning_rate=0.05,
        random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, preds))
    r2 = float(r2_score(y_test, preds))

    print(f"Evaluation Results -> MAE: {mae:.3f}, R2 Score: {r2:.3f}")

    # Export ONNX
    output_path = base_dir.parent / 'server' / 'src' / 'models' / 'onnx' / 'ats_model.onnx'
    export_to_onnx(model, input_shape=len(feature_cols), output_path=output_path)

    # Update metrics.json
    metrics_path = base_dir / 'metrics.json'
    metrics_data = {}
    if metrics_path.exists():
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics_data = json.load(f)
        except Exception:
            metrics_data = {}

    metrics_data['ats_model'] = {
        'trained_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'rows': len(df),
        'features': len(feature_cols),
        'mae': round(mae, 4),
        'r2': round(r2, 4),
        'output_path': 'server/src/models/onnx/ats_model.onnx'
    }

    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)

    print(f"Saved metrics to {metrics_path}")

if __name__ == '__main__':
    train_ats()
