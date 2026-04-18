from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import molecules, predictions, analyze, targets, structure, synthesis, repurposing

app = FastAPI(title="AI Drug Discovery Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


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
