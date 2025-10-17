from datetime import datetime
from typing import Optional
from pydantic import UUID4, BaseModel


class EventSchema(BaseModel):
    id: Optional[UUID4] = None
    name: str
    description: str
    start_time: datetime
    end_time: datetime
    max_capacity: int


class AttendeeSchema(BaseModel):
    id: Optional[UUID4] = None
    name: str
    email: str
