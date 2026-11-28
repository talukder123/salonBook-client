
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import type { IService } from "../../../../../type/service";
import AppointmentBookingPanel from "@/components/appointment/AppointmentBookingPanel";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface IApiResponse {
  service?: IService;
  data?: IService;
  message?: string;
}

async function getService(
  id: string
): Promise<{ service: IService | null; error: string | null }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return { service: null, error: "API URL is not configured." };
    }

    const { token } = await auth.api.getToken({
      headers: await headers(),
    });

    const response = await fetch(`${apiUrl}/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("SERVICE API STATUS:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("SERVICE API ERROR:", errorBody);

      if (response.status === 400) {
        return { service: null, error: "Invalid service ID." };
      }

      if (response.status === 404) {
        return { service: null, error: "This service does not exist." };
      }

      return {
        service: null,
        error: "Failed to load service information.",
      };
    }

    const result: IApiResponse | IService = await response.json();

    const service =
      ("service" in result && result.service) ||
      ("data" in result && result.data) ||
      (result as IService);

    if (!service?._id) {
      return { service: null, error: "Invalid service information." };
    }

    return { service, error: null };
  } catch (error) {
    console.error("GET SERVICE ERROR:", error);

    return {
      service: null,
      error: "Something went wrong. Please try again.",
    };
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const { service, error } = await getService(id);

  if (!service) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA] px-5">
        <div className="w-full max-w-md border border-gray-200 bg-white p-10 text-center">
          <Sparkles size={36} className="mx-auto mb-5 text-[#0B1F54]" />

          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Service Not Found
          </h1>

          <p className="mb-7 text-sm leading-7 text-gray-500">
            {error || "The service you are looking for does not exist."}
          </p>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-[#0B1F54] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173779]"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const isActive = service.status === "active";

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">

        {/* Back Navigation */}
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0B1F54]"
        >
          <ArrowLeft size={16} />
          Back to all services
        </Link>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2.1fr_1fr]">

          {/* Left Column */}
          <div className="min-w-0 space-y-5">

            {/* Service Image */}
            <div className="relative aspect-[16/9] overflow-hidden border border-gray-200 bg-gray-100">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.serviceName}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Sparkles size={50} />
                </div>
              )}

              <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0B1F54]">
                {service.category}
              </span>
            </div>

            {/* Service Title */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 ${isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                  />
                  {isActive ? "Active" : "Inactive"}
                </span>

                <span className="bg-[#F1F0EC] px-3 py-1 text-xs font-medium text-gray-600">
                  Salon Service
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {service.serviceName}
              </h1>
            </div>

            {/* Overview */}
            <section className="border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-bold text-gray-900">
                Overview
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                {service.description}
              </p>
            </section>

            {/* Service Details */}
            <section className="border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-bold text-gray-900">
                Service Details
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="border border-gray-200 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                    Service Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#F97316]">
                    ৳{service.price.toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-base font-bold text-gray-900">
                    <Clock size={15} className="text-[#0B1F54]" />
                    {service.duration} minutes
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {service.category}
                  </p>
                </div>

                <div className="border border-gray-200 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                    Availability
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${isActive ? "text-green-700" : "text-red-600"
                      }`}
                  >
                    {isActive ? "Available for booking" : "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* Booking Policy */}
            <section className="border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0B1F54]/5 text-[#0B1F54]">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h2 className="mb-1 text-sm font-bold text-gray-900">
                    Booking Policy
                  </h2>

                  <p className="text-xs leading-6 text-gray-500">
                    Your appointment request will remain pending until
                    the salon administrator reviews and confirms it.
                    Payment is required only after confirmation.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="lg:sticky lg:top-6">
            <div className="border border-gray-200 bg-white">

              {/* Price Summary */}
              <div className="border-b border-gray-200 p-5">
                <p className="text-xs text-gray-500">Service Price</p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#F97316]">
                    ৳{service.price.toLocaleString("en-BD")}
                  </span>

                  <span className="text-xs text-gray-500">
                    / service
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-xs">
                  <span className="text-gray-500">Estimated duration</span>
                  <span className="font-semibold text-gray-800">
                    {service.duration} minutes
                  </span>
                </div>
              </div>

              {/* Appointment Form */}
              {isActive ? (
                <AppointmentBookingPanel serviceId={service._id} />
              ) : (
                <div className="p-6 text-center">
                  <CalendarDays
                    size={30}
                    className="mx-auto mb-3 text-gray-400"
                  />

                  <h3 className="text-sm font-bold text-gray-900">
                    Booking Unavailable
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    This service is currently inactive and cannot
                    accept appointment requests.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Need help? Contact our salon support team.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
