from typing import Annotated
from fastapi import APIRouter, Depends, Query
from pydantic import UUID4
from app.services.events import EventService

from app.schemas.events import AttendeeSchema, EventSchema
from app.utils import APIError, APIResponse, PaginatedResponse, PaginationParams

router = APIRouter()

ServiceDep = Annotated[EventService, Depends(EventService)]


@router.post("/events")
async def create_event(
    event: EventSchema, event_service: ServiceDep
) -> APIResponse[EventSchema]:
    try:
        return APIResponse(data=event_service.create_event(event))
    except Exception as e:
        raise APIError(str(e))


@router.get("/events")
async def get_events(
    event_service: ServiceDep, query: Annotated[PaginationParams, Query()]
) -> APIResponse[PaginatedResponse[EventSchema]]:
    try:
        return APIResponse(data=event_service.get_events(query.limit, query.offset))
    except Exception as e:
        raise APIError(str(e))


@router.put("/events/{event_id}")
async def update_event(
    event_id: UUID4, event: EventSchema, event_service: ServiceDep
) -> APIResponse[EventSchema]:
    try:
        return APIResponse(data=event_service.update_event(event_id, event))
    except Exception as e:
        raise APIError(str(e))


@router.delete("/events/{event_id}")
async def delete_event(
    event_id: UUID4, event_service: ServiceDep
) -> APIResponse[EventSchema]:
    try:
        return APIResponse(data=event_service.delete_event(event_id))
    except Exception as e:
        raise APIError(str(e))


@router.get("/events/{event_id}")
async def get_event(
    event_id: UUID4, event_service: ServiceDep
) -> APIResponse[EventSchema]:
    try:
        return APIResponse(data=event_service.get_event(event_id))
    except Exception as e:
        raise APIError(str(e))


@router.post("/events/{event_id}/register")
async def register_attendee(
    event_id: UUID4, attendee: AttendeeSchema, event_service: ServiceDep
) -> APIResponse[AttendeeSchema]:
    try:
        return APIResponse(data=event_service.register_attendee(event_id, attendee))
    except Exception as e:
        raise APIError(str(e))


@router.get("/events/{event_id}/attendees")
async def list_attendees(
    event_id: UUID4,
    event_service: ServiceDep,
    query: Annotated[PaginationParams, Query()],
) -> APIResponse[PaginatedResponse[AttendeeSchema]]:
    try:
        return APIResponse(
            data=event_service.list_attendees(event_id, query.offset, query.limit)
        )
    except Exception as e:
        raise APIError(str(e))
