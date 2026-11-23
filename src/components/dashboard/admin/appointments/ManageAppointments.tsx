
"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Check,
  X,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  Mail,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";
type PaymentStatus = "unpaid" | "paid";

interface IAppointment {
  _id: string;
  serviceId: string;
  customerId: string;
  customer?: {
    name: string;
    email: string;
    image?: string;
  };
  service?: {
    serviceName: string;
    category: string;
    price: number;
    duration: number;
    image: string;
  };
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

interface IAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: IAppointment[];
}

const appointmentStatusStyles: Record<AppointmentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
          }
        );

        const result: IAppointmentsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch appointments."
          );
        }

        setAppointments(result.appointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Format Date
  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Temporary UI Status Update

  // Update Appointment Status
  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    try {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to update appointment."
    );
  }

  // Update frontend state after successful backend update
  setAppointments((previousAppointments) =>
    previousAppointments.map((appointment) =>
      appointment._id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    )
  );

  toast.success(result.message);
  setSelectedAppointment(null);
} catch (error) {
      console.error("Appointment update failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  };


  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F54] sm:text-3xl">
          Manage Appointments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage all customer appointment requests.
        </p>
      </div>

      {/* Appointment Table */}
      <div className="overflow-hidden border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            All Appointments
          </h2>

          <span className="text-sm text-gray-500">
            {appointments.length} appointments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Appointment</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin border-4 border-gray-200 border-t-[#0B1F54]" />
                    <p className="mt-3 text-sm text-gray-500">
                      Loading appointments...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-gray-500"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {appointment.customer?.name || "Not available"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.customer?.email || "No email available"}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {appointment.service?.serviceName || "Service unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.service?.category || "N/A"}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      ৳{appointment.servicePrice.toLocaleString("en-BD")}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block border px-2.5 py-1 text-xs font-medium capitalize ${appointmentStatusStyles[appointment.status]}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block border px-2.5 py-1 text-xs font-medium capitalize ${appointment.paymentStatus === "paid"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-100 text-gray-600"
                          }`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() =>
                            setSelectedAppointment(appointment)
                          }
                          title="View Details"
                          className="border border-gray-200 p-2 text-gray-600 hover:border-[#0B1F54] hover:text-[#0B1F54]"
                        >
                          <Eye size={16} />
                        </button>

                        {appointment.status === "pending" && (
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "confirmed"
                              )
                            }
                            title="Confirm Appointment"
                            className="border border-green-200 p-2 text-green-700 hover:bg-green-50"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {(appointment.status === "pending" ||
                          appointment.status === "confirmed") && (
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "cancelled"
                                )
                              }
                              title="Cancel Appointment"
                              className="border border-red-200 p-2 text-red-600 hover:bg-red-50"
                            >
                              <X size={16} />
                            </button>
                          )}

                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-auto w-full max-w-2xl border border-gray-200 bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0B1F54]">
                  Appointment Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Booking ID: {selectedAppointment._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 text-gray-500 hover:bg-gray-100"
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* Customer Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                  <UserRound size={18} className="text-[#0B1F54]" />
                  Customer Information
                </h3>

                <div className="space-y-2 border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.customer?.name || "Not available"}
                  </p>

                  <p className="flex items-center gap-2 text-gray-500">
                    <Mail size={15} />
                    {selectedAppointment.customer?.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                  <Scissors size={18} className="text-[#0B1F54]" />
                  Service Information
                </h3>

                <div className="border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p className="font-medium text-gray-800">
                    {selectedAppointment.service?.serviceName || "Service unavailable"}
                  </p>

                  <p className="mt-1 text-gray-500">
                    {selectedAppointment.service?.category || "N/A"}
                  </p>

                  <p className="mt-3 font-semibold text-[#0B1F54]">
                    ৳{selectedAppointment.servicePrice.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Appointment Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                  <CalendarDays size={18} className="text-[#0B1F54]" />
                  Appointment Information
                </h3>

                <div className="grid grid-cols-2 gap-3 border border-gray-200 bg-gray-50 p-4 text-sm">

                  <div>
                    <p className="text-xs text-gray-500">Appointment Date</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {formatDate(selectedAppointment.appointmentDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Time Slot</p>
                    <p className="mt-1 flex items-center gap-1 font-medium text-gray-800">
                      <Clock3 size={14} />
                      {selectedAppointment.timeSlot}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Appointment Status</p>
                    <p className="mt-1 font-medium capitalize text-gray-800">
                      {selectedAppointment.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p className="mt-1 font-medium capitalize text-gray-800">
                      {selectedAppointment.paymentStatus}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">
                      Booking Request Date
                    </p>
                    <p className="mt-1 font-medium text-gray-800">
                      {new Date(
                        selectedAppointment.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>
              </div>

              {/* Customer Message */}
              {selectedAppointment.message && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                    <MessageSquare size={18} className="text-[#0B1F54]" />
                    Customer Message
                  </h3>

                  <p className="border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 px-5 py-4">

              <button
                onClick={() => setSelectedAppointment(null)}
                className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedAppointment.status === "pending" && (
                <button
                  onClick={() =>
                    updateAppointmentStatus(
                      selectedAppointment._id,
                      "confirmed"
                    )
                  }
                  className="bg-[#0B1F54] px-4 py-2 text-sm font-medium text-white hover:bg-[#142f70]"
                >
                  Confirm Appointment
                </button>
              )}

              {(selectedAppointment.status === "pending" ||
                selectedAppointment.status === "confirmed") && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment._id,
                        "cancelled"
                      )
                    }
                    className="border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel Appointment
                  </button>
                )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageAppointments;