"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RegisterDialog } from "@/components/RegisterEvent";
import { registerEvent } from "@/api/events";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
}

interface Attendee {
  id: string;
  name: string;
}

export default function EventPage({
  event,
  attendees,
  totalAttendees,
}: {
  event: Event;
  attendees: Attendee[];
  totalAttendees: number;
}) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const params = useSearchParams();

  const currentPage = parseInt(params?.get("page") || "1");
  const itemsPerPage = 3;
  const totalPages = Math.ceil(totalAttendees / itemsPerPage);

  const load = (dir: number) => {
    const page = params?.get("page") || "1";
    const nextPage = parseInt(page) + dir;
    return `/events/${event.id}?page=${nextPage}`;
  };

  const handleRegister = (data: { name: string; email: string }) => {
    setLoading(true);
    registerEvent(event.id, data)
      .then(() => {
        toast.success("Registration successful!");
        router.refresh();
        setRegistered(true);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="font-inter px-6 py-16 max-w-4xl mx-auto">
      {/* Title and Description */}
      <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-700 mb-8 leading-relaxed">{event.description}</p>

      <Separator className="mb-8" />

      {/* Event Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-6 text-sm mb-10">
        <div>
          <span className="block text-muted-foreground mb-1 font-medium">
            Start Date:{" "}
          </span>
          <span className="text-foreground">{event.start_time}</span>
        </div>
        <div>
          <span className="block text-muted-foreground mb-1 font-medium">
            End Date:{" "}
          </span>
          <span className="text-foreground">{event.end_time}</span>
        </div>
        <div>
          <span className="block text-muted-foreground mb-1 font-medium">
            Max Capacity:{" "}
          </span>
          <span className="text-foreground">{event.max_capacity}</span>
        </div>
      </div>

      {/* Register Button */}
      <div className="mb-12">
        <Button
          onClick={() => setRegisterOpen(true)}
          disabled={registered || loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : registered ? (
            "Registered"
          ) : (
            "Register as Attendee"
          )}
        </Button>
      </div>

      <RegisterDialog
        open={registerOpen}
        setOpen={setRegisterOpen}
        onSubmit={handleRegister}
      />

      {/* Attendees Section */}
      <Separator className="my-10" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold mt-4">Attendees</h2>
        <p className="text-sm text-muted-foreground">
          {totalAttendees} / {event.max_capacity} spots filled
        </p>
      </div>

      {attendees.length > 0 ? (
        <div>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px] text-center">#</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee, index) => (
                  <TableRow key={attendee.id} className="h-10">
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium text-center">
                      {attendee.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            {/* Previous button */}
            <span className="text-muted text-sm">{`Showing ${currentPage} of ${totalPages}`}</span>
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
      ) : (
        <p className="text-muted-foreground text-sm">
          No attendees yet. Be the first to register!
        </p>
      )}
    </div>
  );
}
