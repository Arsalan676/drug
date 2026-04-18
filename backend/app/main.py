from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import molecules, predictions, analyze, targets, structure, synthesis, repurposing

app = FastAPI(title="AI Drug Discovery Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


app.include_router(molecules.router, prefix="/api/v1")
app.include_router(predictions.router, prefix="/api/v1")
app.include_router(analyze.router, prefix="/api/v1")
app.include_router(targets.router, prefix="/api/v1")
app.include_router(structure.router, prefix="/api/v1")
app.include_router(synthesis.router, prefix="/api/v1")
app.include_router(repurposing.router, prefix="/api/v1")
