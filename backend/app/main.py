from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import molecules, predictions, analyze, targets, structure, synthesis, repurposing

app = FastAPI(title="AI Drug Discovery Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


@app.exception_handler(Exception)
async def generic_exception_handler(_request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"},
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
