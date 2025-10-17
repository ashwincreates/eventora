import { PaginatedResponse, Response } from "@/types/api";
import { validateResponse } from "./utils";
import { Attendee, Event } from "@/types/event";
import { format } from "date-fns";

const API_URL = "http://localhost:8000";

const formatDate = (date: Date) => format(date, "dd MMM yyyy, hh:mm a");

export const fetchEvents = async (page: number = 1, limit: number = 5) => {
  const offset = (page - 1) * limit;
  const response = await fetch(
    `${API_URL}/events?offset=${offset}&limit=${limit}`,
    { cache: "no-store" },
  );
  const data: Response<PaginatedResponse<Event>> = await response.json();

  const validData = validateResponse(data);

  validData.rows.forEach((event) => {
    event.start_time = formatDate(new Date(event.start_time));
    event.end_time = formatDate(new Date(event.end_time));
  });

  return validData;
};

export const createEvent = async (event: Omit<Event, "id">) => {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  const data: Response<Event> = await response.json();

  return validateResponse(data);
};

export const updateEvent = async (event: Event) => {
  const response = await fetch(`${API_URL}/events/${event.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  const data: Response<Event> = await response.json();

  return validateResponse(data);
};

export const deleteEvent = async (id: string) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });

  const data: Response<Event> = await response.json();

  return validateResponse(data);
};

export const fetchEvent = async (id: string) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  const data: Response<Event> = await response.json();

  const event = data.data;
  data.data = {
    ...event,
    start_time: formatDate(new Date(event.start_time)),
    end_time: formatDate(new Date(event.end_time)),
  };

  return validateResponse(data);
};

export const registerEvent = async (
  id: string,
  attendee: Omit<Attendee, "id">,
) => {
  const response = await fetch(`${API_URL}/events/${id}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attendee),
  });

  const data: Response<Event> = await response.json();

  return validateResponse(data);
};

export const listAttendees = async (id: string, page = 1, limit = 10) => {
  const response = await fetch(
    `${API_URL}/events/${id}/attendees?offset=${(page - 1) * limit}&limit=${limit}`,
  );
  const data: Response<PaginatedResponse<Attendee>> = await response.json();

  const validData = validateResponse(data);

  return validData;
};
