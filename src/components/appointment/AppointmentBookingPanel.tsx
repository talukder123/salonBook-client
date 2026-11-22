
"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
];

export default function AppointmentBookingPanel() {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!date || !timeSlot) {
      toast.error("Please select an appointment date and time.");
      return;
    }

    toast.info("Appointment booking will be implemented soon.");
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B1F54]">
          Request an Appointment
        </p>

        <h2 className="mt-2 text-xl font-bold text-gray-900">
          Choose your time
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          The salon will confirm your request shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Date */}
        <div>
          <label
            htmlFor="appointmentDate"
            className="mb-2 block text-xs font-semibold text-gray-800"
          >
            Appointment date
          </label>

          <input
            id="appointmentDate"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 bg-white px-3 py-3 text-xs text-gray-700 outline-none focus:border-[#0B1F54]"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label
            htmlFor="timeSlot"
            className="mb-2 block text-xs font-semibold text-gray-800"
          >
            Time slot
          </label>

          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="w-full border border-gray-300 bg-white px-3 py-3 text-xs text-gray-700 outline-none focus:border-[#0B1F54]"
          >
            <option value="">Select a time</option>

            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <p className="mt-2 text-[10px] text-gray-500">
            Choose your preferred appointment time.
          </p>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-semibold text-gray-800"
          >
            Message for the salon{" "}
            <span className="font-normal text-gray-400">
              (optional)
            </span>
          </label>

          <textarea
            id="message"
            rows={4}
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything we should know before your visit?"
            className="w-full resize-y border border-gray-300 bg-white px-3 py-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#0B1F54]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-[#0B1F54] px-5 py-3.5 text-xs font-bold text-white transition hover:bg-[#173779]"
        >
          <CalendarDays size={15} />
          Request Appointment
        </button>
      </form>
    </div>
  );
}