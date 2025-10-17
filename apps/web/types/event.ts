export interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
}
