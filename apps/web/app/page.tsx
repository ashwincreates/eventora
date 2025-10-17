import { fetchEvents } from "@/api/events";
import HomePage from "@/pages/HomePage";

export default async function EventHomePage() {
  const events = await fetchEvents(1, 3).catch(() => ({ rows: [] }));

  return <HomePage events={events.rows} />;
}
