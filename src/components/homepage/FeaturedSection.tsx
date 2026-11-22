
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface IService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
}

const FeaturedServices = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/featured-services`
        );

        if (!res.ok) {
          throw new Error("Failed to load services");
        }

        const data = await res.json();

        const allServices = Array.isArray(data)
          ? data
          : data.services || [];

        const activeServices = allServices.filter(
          (service: IService) => service.status === "active"
        );

        setServices(activeServices.slice(0, 6));

      } catch (error) {
        console.error("Services fetching error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16 xl:px-20">

      {/* Section Heading */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-[#0B1F54]">
            Our Services
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Salon Services
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Discover our popular beauty treatments and
            give yourself the care you deserve.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex h-11 items-center justify-center border border-[#0B1F54] px-6 text-sm font-semibold text-[#0B1F54] transition hover:bg-[#0B1F54] hover:text-white"
        >
          View All Services →
        </Link>

      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="animate-pulse border border-gray-200"
            >
              <div className="aspect-[5/4] bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 bg-gray-200" />
                <div className="h-5 w-2/3 bg-gray-200" />
                <div className="h-3 w-full bg-gray-200" />
                <div className="h-10 w-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-600">{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && services.length === 0 && (
        <div className="border border-gray-200 py-16 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            No Services Available
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Our salon services will appear here soon.
          </p>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <div
              key={service._id}
              className="group overflow-hidden border border-gray-200 bg-white transition hover:border-[#0B1F54] hover:shadow-lg"
            >

              {/* Service Image */}
              <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">

                <Image
                  src={service.image}
                  alt={service.serviceName}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 bg-white px-3 py-2 text-xs font-semibold text-[#0B1F54]">
                  {service.category}
                </span>

              </div>

              {/* Service Information */}
              <div className="space-y-4 p-5">

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>
                </div>

                {/* Price & Duration */}
                <div className="flex items-center justify-between border-y border-gray-100 py-3">

                  <div>
                    <p className="text-xs text-gray-500">
                      Starting Price
                    </p>
                    <p className="mt-1 text-lg font-bold text-[#0B1F54]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Duration
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {service.duration} Minutes
                    </p>
                  </div>

                </div>

                {/* View Details */}
                <Link
                  href={`/services/${service._id}`}
                  className="flex h-11 w-full items-center justify-center bg-[#0B1F54] text-sm font-semibold text-white transition hover:bg-[#142f70]"
                >
                  View Details
                </Link>

              </div>
            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default FeaturedServices;