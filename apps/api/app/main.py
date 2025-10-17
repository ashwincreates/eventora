from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from starlette.responses import JSONResponse
from app.api.routes.events import router as event_router
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import close, create_tables

from .utils import APIError


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_tables()
    yield
    close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # list of allowed origins
    allow_credentials=True,  # allow cookies
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

app.include_router(event_router)


@app.exception_handler(APIError)
async def api_error_handler(_request: Request, exc: APIError):
    return JSONResponse(content={"message": exc.message, "success": False})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, exc: RequestValidationError):
    return JSONResponse(
        content={
            "message": str(
                ",".join(
                    [f"{error['loc'][-1]}: {error['msg']}" for error in exc.errors()]
                )
            ),
            "success": False,
        }
    )
