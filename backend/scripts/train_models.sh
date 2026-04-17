#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
python -m app.services.model_trainer
