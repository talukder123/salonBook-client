
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock,
  CalendarCheck,
  CreditCard,
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
}

const AdminOverview = () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard-overview`,
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
        console.error("Dashboard Overview Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <section>
        {/* Heading Skeleton */}
        <div className="mb-7 space-y-3">
          <div className="h-4 w-36 animate-pulse bg-gray-200" />
          <div className="h-8 w-64 animate-pulse bg-gray-200" />
          <div className="h-4 w-80 max-w-full animate-pulse bg-gray-100" />
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="h-4 w-40 max-w-full animate-pulse bg-gray-200" />
                  <div className="h-9 w-20 animate-pulse bg-gray-200" />
                </div>

                <div className="h-12 w-12 animate-pulse bg-gray-100" />
              </div>

              <div className="mt-5 h-1 w-full animate-pulse bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-600">
          Failed to load dashboard overview.
        </p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registered Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Active Services",
      value: stats.totalActiveServices,
      icon: Scissors,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Appointment Requests",
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: "bg-orange-50 text-orange-600",
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
      title: "Total Successful Payments",
      value: stats.totalSuccessfulPayments,
      icon: CreditCard,
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <section>
      <div className="mb-7">
        <p className="text-sm font-medium text-orange-500">
          Dashboard Overview
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Welcome to SalonBook
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Here&apos;s a quick overview of your salon&apos;s performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium leading-6 text-gray-500">
                    {card.title}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                    {card.value.toLocaleString()}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-1/3 rounded-full bg-orange-400 transition-all duration-500 group-hover:w-2/3" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AdminOverview;