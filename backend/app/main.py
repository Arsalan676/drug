from fastapi import FastAPI
from starlette.datastructures import MutableHeaders
from starlette.responses import Response as StarletteResponse
from starlette.types import ASGIApp, Receive, Scope, Send

from app.routers import molecules, predictions, analyze, targets, structure, synthesis, repurposing

# ── Raw ASGI CORS wrapper ─────────────────────────────────────────────────────
# Injected at the outermost layer so headers are present on ALL responses,
# including 500 errors and Railway proxy errors that bypass FastAPI middleware.

_CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "3600",
}


class BulletproofCORS:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Respond to OPTIONS preflight immediately — never touch the inner app
        if scope.get("method") == "OPTIONS":
            response = StarletteResponse(status_code=200, headers=_CORS)
            await response(scope, receive, send)
            return

        # Inject CORS headers on every other response
        async def send_with_cors(message: dict) -> None:
            if message["type"] == "http.response.start":
                headers = MutableHeaders(scope=message)
                for key, value in _CORS.items():
                    headers[key] = value
            await send(message)

        await self.app(scope, receive, send_with_cors)


# ── FastAPI app ───────────────────────────────────────────────────────────────

_app = FastAPI(title="AI Drug Discovery Simulator API")


@_app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


_app.include_router(molecules.router, prefix="/api/v1")
_app.include_router(predictions.router, prefix="/api/v1")
_app.include_router(analyze.router, prefix="/api/v1")
_app.include_router(targets.router, prefix="/api/v1")
_app.include_router(structure.router, prefix="/api/v1")
_app.include_router(synthesis.router, prefix="/api/v1")
_app.include_router(repurposing.router, prefix="/api/v1")

# Wrap with bulletproof CORS — must be last so it is outermost
app = BulletproofCORS(_app)
