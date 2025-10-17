"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const eventSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    start_time: z.string().min(1, "Start date is required"),
    end_time: z.string().min(1, "End date is required"),
    max_capacity: z
      .number({ error: "Max capacity must be a number" })
      .min(1, "Must be at least 1"),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_time);
      return start > new Date();
    },
    {
      message: "Start time must be in future",
      path: ["start_time"],
    },
  )
  .refine(
    (data) => {
      const end = new Date(data.end_time);
      return end > new Date();
    },
    {
      message: "End time must be in future",
      path: ["end_time"],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return start < end;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

type EventFormValues = z.infer<typeof eventSchema>;

const local = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

interface EventDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: (values: EventFormValues) => Promise<unknown>;
}

export function EventDialog({ open, setOpen, onSubmit }: EventDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      start_time: local(new Date()),
      end_time: local(new Date()),
      max_capacity: 10,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const handleSubmit = (values: EventFormValues) => {
    setLoading(true);
    onSubmit?.(values)
      .then(() => {
        toast.info("Event created successfully");
        router.refresh();
      })
      .catch((error) => toast.error(error))
      .finally(() => {
        setOpen(false);
        form.reset();
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Select date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="max_capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create Event"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
