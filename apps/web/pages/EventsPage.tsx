"use client";
import { createEvent } from "@/api/events";
import { EventDialog } from "@/components/CreateEvent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/types/event";
import { useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link";
import { useState } from "react";

export default function EventsPage({
  events,
  totalEvents,
}: {
  events: Event[];
  totalEvents: number;
}) {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();

  const currentPage = parseInt(params?.get("page") || "1");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const load = (dir: number) => {
    const page = params?.get("page") || "1";
    const nextPage = parseInt(page) + dir;
    return `/events?page=${nextPage}`;
  };

  return (
    <div className="font-inter py-16 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">All Events</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Browse through all upcoming and past events. Stay updated and never
          miss an opportunity to connect and learn.
        </p>
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          variant="secondary"
          className="font-semibold"
        >
          Create Event
        </Button>
        <EventDialog
          open={open}
          setOpen={setOpen}
          onSubmit={(data) => createEvent(data)}
        />
      </div>

      <Separator className="mb-10" />

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.start_time} - {event.end_time}
                </p>
                <p className="text-sm text-gray-700">{event.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
        {/* Previous button */}
        {currentPage !== 1 ? (
          <Link href={load(-1)} passHref>
            <Button variant="outline" size="sm">
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}

        {/* Page numbers */}
        <Button size="sm">{currentPage}</Button>

        {/* Next button */}
        {currentPage !== totalPages ? (
          <Link href={load(1)} passHref>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
