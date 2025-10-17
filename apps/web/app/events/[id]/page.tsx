import { fetchEvent, listAttendees } from "@/api/events";
import EventPage from "@/pages/EventPage";
import { notFound } from "next/navigation";
import { toast } from "sonner";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: number };
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const event = await fetchEvent(id).catch(() => {
    notFound();
  });
  const attendees = await listAttendees(id, page || 1, 3).catch(() => {
    return { rows: [], total: 0 };
  });
  return (
    <EventPage
      event={event}
      attendees={attendees.rows}
      totalAttendees={attendees.total}
    />
  );
}
