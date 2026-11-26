
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  Clock,
  CalendarCheck,
  CalendarX,
} from "lucide-react";

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

const UserOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/dashboard-overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        setStats(result.data);
      } catch (error) {
        console.error("Customer Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="rounded-xl bg-red-50 p-5 text-red-600">
      Failed to load dashboard overview.
    </p>;
  }

  const cards = [
    {
      title: "Total Appointment Requests",
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Confirmed Appointments",
      value: stats.confirmedAppointments,
      icon: CalendarCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Cancelled Appointments",
      value: stats.cancelledAppointments,
      icon: CalendarX,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-medium text-orange-500">
          Customer Dashboard
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Welcome to SalonBook
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Keep track of your appointments and their current status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-1/3 rounded-full bg-orange-400 transition-all duration-500 group-hover:w-2/3" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserOverview;
