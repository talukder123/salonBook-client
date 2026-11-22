
"use client";

import { useEffect, useState } from "react";

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
  };
}

interface IAppointmentsResponse {
  success: boolean;
  message: string;
  appointments: IAppointment[];
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-appointments`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result: IAppointmentsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch your appointments."
          );
        }

        setAppointments(result.appointments || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === activeTab
        );

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
            className={`border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.value
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
            <table className="w-full min-w-[950px] border-collapse text-left">
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
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    {/* Service */}
                    <td className="px-5 py-6">
                      <p className="font-semibold text-gray-800">
                        {appointment.service?.serviceName || "Service unavailable"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.service?.category || "N/A"}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-6">
                      <p className="whitespace-nowrap font-medium text-gray-800">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.timeSlot}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-6 font-semibold text-[#0B1F54]">
                      ৳{appointment.servicePrice.toLocaleString("en-BD")}
                    </td>

                    {/* Appointment Status */}
                    <td className="px-5 py-6">
                      <span
                        className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[appointment.status]}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-6">
                      <span
                        className={`inline-block border px-3 py-1.5 text-xs font-semibold capitalize ${
                          appointment.paymentStatus === "paid"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {appointment.paymentStatus}
                      </span>
                    </td>

                    {/* Requested Date */}
                    <td className="whitespace-nowrap px-5 py-6 text-sm text-gray-600">
                      {formatRequestedDate(appointment.createdAt)}
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
                  You do not have any {activeTab === "all" ? "" : activeTab}{" "}
                  appointments yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;