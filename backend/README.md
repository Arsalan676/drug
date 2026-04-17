# AI Drug Discovery Simulator — Backend

FastAPI backend for the AI Drug Discovery Simulator.

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Train Models

```bash
bash scripts/train_models.sh
```

## Run Server

```bash
uvicorn app.main:app --reload
```

## Run Tests

```bash
pytest tests/
```

API docs: http://localhost:8000/docs
