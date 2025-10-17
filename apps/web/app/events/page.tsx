import { fetchEvents } from "@/api/events";
import EventsPage from "@/pages/EventsPage";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { page: number };
}) {
  const { page } = await searchParams;
  const events = await fetchEvents(page || 1, 6).catch(() => {
    redirect("/");
  });

  return <EventsPage events={events.rows} totalEvents={events.total} />;
}
