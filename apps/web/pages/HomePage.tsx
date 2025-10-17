"use client";
import { EventDialog } from "@/components/CreateEvent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/types/event";
import Link from "next/link";
import { useState } from "react";

export default function HomePage({ events }: { events: Event[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="font-inter">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Discover & Host Amazing Events
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of creators organizing events that inspire and
            connect people across the globe.
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            variant="secondary"
            className="font-semibold"
          >
            Create Event
          </Button>
          <EventDialog setOpen={setIsOpen} open={isOpen} />
        </div>
      </section>

      {/* RECENT EVENTS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recent Events
          </h2>
          <Link href="/events">
            <Button variant="outline" size="sm">
              See More
            </Button>
          </Link>
        </div>

        <Separator className="mb-10" />

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
      </section>
    </div>
  );
}
