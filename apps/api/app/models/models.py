from uuid import uuid4, UUID
from datetime import datetime
from sqlmodel import Column, DateTime, SQLModel, Field, Relationship

from app.schemas.events import AttendeeSchema, EventSchema


class Event(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    description: str
    start_time: datetime = Field(
        default=datetime.now, sa_column=Column(DateTime(timezone=True))
    )
    end_time: datetime = Field(
        default=datetime.now, sa_column=Column(DateTime(timezone=True))
    )
    max_capacity: int
    attendees: list["Attendee"] = Relationship(back_populates="event")

    def to_schema(self):
        return EventSchema(
            id=self.id,
            name=self.name,
            description=self.description,
            start_time=self.start_time,
            end_time=self.end_time,
            max_capacity=self.max_capacity,
        )


class Attendee(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    email: str
    event_id: UUID = Field(default=None, foreign_key="event.id")
    event: Event = Relationship(back_populates="attendees")

    def to_schema(self):
        return AttendeeSchema(
            id=self.id,
            name=self.name,
            email=self.email,
        )
