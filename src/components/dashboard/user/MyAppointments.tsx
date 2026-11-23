
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Eye, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { useRouter } from "next/navigation";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";
type TabType = "all" | AppointmentStatus;

interface IAppointment {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
  service?: {
    serviceName: string;
    category: string;
    price: number;
    duration: number;
    image: string;
  } | null;
}

interface IAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: IAppointment[];
}

interface IApiResponse {
  success: boolean;
  message: string;
}

const tabs: { label: string; value: TabType }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-300",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-300",
  cancelled: "bg-red-50 text-red-700 border-red-300",
};

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected appointment for details modal
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string | null>(null);

  // Cancellation states
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const router = useRouter();

  // Fetch customer appointments
  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Failed to retrieve authentication token.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-appointments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result: IAppointmentsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch your appointments."
          );
        }

        if (isMounted) {
          setAppointments(result.appointments || []);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);

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

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Cancel appointment
  const handleCancelAppointment = async () => {
    if (!cancelTargetId || cancellingId) return;

    const id = cancelTargetId;

    try {
      setCancellingId(id);

      // Get JWT token
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      // Cancel appointment API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-appointments/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result: IApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to cancel appointment."
        );
      }

      // Update appointment status
      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      // Close confirmation modal
      setCancelTargetId(null);

      // Success toast
      toast.success("Appointment Cancelled", {
        description:
          result.message ||
          "Your appointment has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);

      // Error toast
      toast.error("Cancellation Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Payment (will be implemented later)
  const handlePayment = (id: string) => {
    router.push(`/checkout?appointmentId=${id}`);
  };

  // Filter appointments
  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter(
        (appointment) => appointment.status === activeTab
      );

  // Format appointment date
  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Format requested date
  const formatRequestedDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <section className="w-full space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F54] sm:text-3xl">
          My Appointments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your salon appointment requests.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${activeTab === tab.value
                ? "border-[#0B1F54] bg-[#0B1F54] text-white"
                : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-[#0B1F54]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment Table */}
      <div className="w-full overflow-x-auto border border-gray-200 bg-white">
        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-gray-500">
            Loading your appointments...
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center">
            <p className="font-semibold text-red-600">
              Failed to load appointments
            </p>

            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            <table className="w-full min-w-[1150px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Service
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Date & Time
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Appointment
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Requested
                  </th>

                  <th className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    {/* Service Image & Info */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {appointment.service?.image ? (
                            <Image
                              src={appointment.service.image}
                              alt={appointment.service.serviceName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {appointment.service?.serviceName ||
                              "Service unavailable"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {appointment.service?.category || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-5">
                      <p className="whitespace-nowrap font-medium text-gray-800">
                        {formatDate(appointment.appointmentDate)}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-5 font-semibold text-[#0B1F54]">
                      ৳{appointment.servicePrice.toLocaleString("en-BD")}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-5 py-5">
                      <span
                        className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[appointment.status]
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-5">
                      <span
                        className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${appointment.paymentStatus === "paid"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                          }`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </td>

                    {/* Requested Date */}
                    <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-600">
                      {formatRequestedDate(appointment.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAppointmentId(appointment._id)
                          }
                          title="View appointment details"
                          aria-label="View appointment details"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-[#0B1F54] hover:bg-[#0B1F54] hover:text-white"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Cancel - Pending Only */}
                        {appointment.status === "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              setCancelTargetId(appointment._id)
                            }
                            className="whitespace-nowrap rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Pay Now - Confirmed & Unpaid Only */}
                        {appointment.status === "confirmed" &&
                          appointment.paymentStatus === "unpaid" && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePayment(appointment._id)
                              }
                              className="whitespace-nowrap rounded-lg bg-[#0B1F54] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#142f70]"
                            >
                              Pay Now
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
              <div className="px-5 py-16 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  No appointments found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  You do not have any{" "}
                  {activeTab === "all" ? "" : activeTab} appointments yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelTargetId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!cancellingId) setCancelTargetId(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            className="w-full max-w-md border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={25} />
              </div>

              <button
                type="button"
                disabled={!!cancellingId}
                onClick={() => setCancelTargetId(null)}
                className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <h2
              id="cancel-modal-title"
              className="mt-5 text-xl font-bold text-gray-900"
            >
              Cancel Appointment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel this appointment?
              This action cannot be undone.
            </p>

            {/* Modal Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={!!cancellingId}
                onClick={() => setCancelTargetId(null)}
                className="border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Appointment
              </button>

              <button
                type="button"
                disabled={cancellingId === cancelTargetId}
                onClick={handleCancelAppointment}
                className="bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId === cancelTargetId
                  ? "Cancelling..."
                  : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointmentId && (
        <AppointmentDetailsModal
          appointmentId={selectedAppointmentId}
          onClose={() => setSelectedAppointmentId(null)}
        />
      )}
    </section>
  );
};

export default MyAppointments;
