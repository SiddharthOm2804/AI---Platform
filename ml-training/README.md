# ML Training Lab

This folder contains Python scripts to train custom models for the placement prep platform.
**Python is never used in production.** These scripts run offline, export ONNX files,
and the Node.js server loads them via `onnxruntime-node`.

## Setup

```bash
cd ml-training
python -m venv venv
venv\Scripts\activate          # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
```

## Generate synthetic data

```bash
python data/synthetic_generator.py
```
Creates `data/resumes.csv` (800 rows) and `data/interview_qa.csv` (400 rows).

## Train models

```bash
python train_ats_model.py          # ~30 seconds, outputs ats_model.onnx
python train_role_classifier.py    # ~1 minute, outputs role_classifier.onnx
python train_answer_scorer.py      # DistilBERT transformer or --fast flag
```

## Evaluate

```bash
python evaluate.py
```
Reads metrics from `metrics.json` and evaluates the exported ONNX models.

## Where models go

Trained models are exported directly to:
```
../server/src/models/onnx/
```
The Node.js server loads them at runtime via `server/src/ai/onnxRunner.js`.

## Retraining workflow

1. Collect new data → append to CSVs in `data/`
2. Run the training scripts
3. Restart the Node server (`npm run dev` in `server/`)
4. Server picks up new `.onnx` files without requiring Python

## Verification

After training, verify the `.onnx` files exist:
```
server/src/models/onnx/
├── ats_model.onnx
├── role_classifier.onnx
├── role_classifier_vectorizer.json
└── answer_scorer/ (optional DistilBERT ONNX + tokenizer)
```
