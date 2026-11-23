
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { X } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

interface IAppointmentDetails {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
  message?: string;
  service?: {
    serviceName: string;
    category: string;
    price: number;
    duration: number;
    image: string;
  } | null;
}

interface IAppointmentDetailsResponse {
  success: boolean;
  message: string;
  appointment: IAppointmentDetails;
}

interface AppointmentDetailsModalProps {
  appointmentId: string;
  onClose: () => void;
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-300 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-300 bg-red-50 text-red-700",
};

const AppointmentDetailsModal = ({
  appointmentId,
  onClose,
}: AppointmentDetailsModalProps) => {
  const [appointment, setAppointment] =
    useState<IAppointmentDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Failed to retrieve authentication token.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-appointments/${appointmentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result: IAppointmentDetailsResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch appointment details."
          );
        }

        if (isMounted) {
          setAppointment(result.appointment);
        }
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointmentDetails();

    return () => {
      isMounted = false;
    };
  }, [appointmentId]);

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatRequestedDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2
              id="appointment-modal-title"
              className="text-xl font-bold text-[#0B1F54]"
            >
              Appointment Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete information about your appointment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading appointment details...
          </div>
        ) : error ? (
          /* Error */
          <div className="py-12 text-center">
            <p className="font-semibold text-red-600">
              Failed to load details
            </p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
        ) : appointment ? (
          /* Appointment Details */
          <div className="space-y-5 pt-5">
            {/* Service Information */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {appointment.service?.image && (
                  <Image
                    src={appointment.service.image}
                    alt={appointment.service.serviceName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  {appointment.service?.serviceName ||
                    "Service unavailable"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {appointment.service?.category || "N/A"}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#0B1F54]">
                  ৳{appointment.servicePrice.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">
                  Appointment Date
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Time Slot</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {appointment.timeSlot}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Service Duration
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {appointment.service?.duration ?? "N/A"} minutes
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Requested On</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatRequestedDate(appointment.createdAt)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Appointment Status
                </p>

                <span
                  className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${
                    statusStyles[appointment.status]
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Payment Status
                </p>

                <span
                  className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${
                    appointment.paymentStatus === "paid"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-amber-300 bg-amber-50 text-amber-700"
                  }`}
                >
                  {appointment.paymentStatus}
                </span>
              </div>
            </div>

            {/* Customer Message */}
            {appointment.message && (
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500">
                  Your Message
                </p>

                <p className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                  {appointment.message}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-5 border-t border-gray-200 pt-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0B1F54] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142f70]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
