from typing import Annotated
from fastapi import Depends
from pydantic import UUID4
from sqlalchemy.orm.session import Session
from app.db.session import engine
from app.models.models import Event, Attendee
from app.schemas.events import AttendeeSchema, EventSchema
from app.utils import PaginatedResponse


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


class EventRepository:
    def __init__(self, session: SessionDep) -> None:
        self.session: Session = session

    def get_events(self, limit: int, offset: int) -> PaginatedResponse[EventSchema]:
        events = self.session.query(Event).limit(limit).offset(offset).all()
        total_events = self.session.query(Event).count()
        return PaginatedResponse(
            rows=list(map(lambda x: x.to_schema(), events)), total=total_events
        )

    def get_event(self, event_id: UUID4) -> Event:
        event = self.session.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise Exception("Event does not exist")
        return event

    def register_attendee(self, event_id: UUID4, attendee: AttendeeSchema) -> Attendee:
        event = self.get_event(event_id)
        attendee_exists = (
            self.session.query(Attendee)
            .filter(Attendee.email == attendee.email, Attendee.event_id == event_id)
            .first()
        )
        if attendee_exists:
            raise Exception("Attendee already registered")
        attendees_count = (
            self.session.query(Attendee).filter(Attendee.event_id == event_id).count()
        )
        if not attendees_count < event.max_capacity:
            raise Exception("Sorry, Looks like the event is full")
        _attendee = Attendee(**attendee.model_dump())
        event.attendees.append(_attendee)
        self.session.commit()
        self.session.refresh(_attendee)
        return _attendee

    def list_attendees(
        self, event_id: UUID4, offset: int, limit: int
    ) -> PaginatedResponse[AttendeeSchema]:
        attendees = (
            self.session.query(Attendee)
            .filter(Attendee.event_id == event_id)
            .limit(limit)
            .offset(offset)
            .all()
        )
        print(attendees)
        total_attendees = (
            self.session.query(Attendee).filter(Attendee.event_id == event_id).count()
        )
        return PaginatedResponse(
            rows=list(map(lambda x: x.to_schema(), attendees)), total=total_attendees
        )

    def create_event(self, event: EventSchema) -> Event:
        _event = Event(**event.model_dump())
        self.session.add(_event)
        self.session.commit()
        self.session.refresh(_event)
        return _event

    def update_event(self, event_id: UUID4, new_event: EventSchema) -> Event:
        _event = Event(**new_event.model_dump())
        event = self.get_event(event_id)
        event.name = _event.name
        event.description = _event.description
        event.start_time = _event.start_time
        event.end_time = _event.end_time
        self.session.commit()
        self.session.refresh(_event)
        return _event

    def delete_event(self, event_id: UUID4) -> Event:
        event = self.get_event(event_id)
        self.session.delete(event)
        self.session.commit()
        return event
