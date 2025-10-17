from typing import Generic, Optional, TypeVar
from pydantic import BaseModel


class APIError(Exception):
    def __init__(self, message: str):
        super().__init__()
        self.message = message


T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    data: T
    message: Optional[str] = None
    success: bool = True


class PaginationParams(BaseModel):
    limit: int = 10
    offset: int = 0


class PaginatedResponse(BaseModel, Generic[T]):
    rows: list[T]
    total: int
