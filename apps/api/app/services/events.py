from typing import Annotated
from fastapi import Depends
from pydantic import UUID4
from app.schemas.events import AttendeeSchema, EventSchema
from app.repositories.events import EventRepository


class EventService:
    def __init__(
        self, repository: Annotated[EventRepository, Depends(EventRepository)]
    ):
        self.event_repository = repository

    def get_events(self, limit: int, offset: int):
        return self.event_repository.get_events(limit, offset)

    def create_event(self, event_data: EventSchema):
        return self.event_repository.create_event(event_data).to_schema()

    def update_event(self, event_id: UUID4, event_data: EventSchema):
        return self.event_repository.update_event(event_id, event_data).to_schema()

    def delete_event(self, event_id: UUID4):
        return self.event_repository.delete_event(event_id).to_schema()

    def get_event(self, event_id: UUID4):
        return self.event_repository.get_event(event_id).to_schema()

    def register_attendee(self, event_id: UUID4, attendee: AttendeeSchema):
        return self.event_repository.register_attendee(event_id, attendee).to_schema()

    def list_attendees(self, event_id: UUID4, offset: int = 0, limit: int = 10):
        return self.event_repository.list_attendees(event_id, offset, limit)
