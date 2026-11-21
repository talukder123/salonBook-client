
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IService } from '../../../../type/service';

const SalonServicesPage = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch services');
    }

    const data = await res.json();

    const allServices: IService[] = Array.isArray(data)
        ? data
        : data.services ?? [];

    const services = allServices.filter(
        (service) => service.status === 'active'
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-8 lg:px-16">

            {/* Header */}
            <div className="mx-auto mb-10 max-w-7xl text-center">

                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0B1F54]">
                    Our Services
                </p>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    Explore Our Salon Services
                </h1>

                <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                    Discover professional beauty and salon services
                    designed to make you look and feel your best.
                </p>

            </div>

            {/* Services */}
            <div className="mx-auto max-w-7xl">

                {services.length > 0 ? (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {services.map((service) => (

                            <div
                                key={service._id}
                                className="overflow-hidden border border-gray-200 bg-white transition hover:shadow-md"
                            >

                                {/* Image */}
                                <div className="relative h-56 w-full bg-gray-100">

                                    {service.image && (
                                        <Image
                                            src={service.image}
                                            alt={service.serviceName}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    )}

                                </div>

                                {/* Content */}
                                <div className="space-y-4 p-5">

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0B1F54]">
                                            {service.category}
                                        </span>

                                        <span className="text-sm font-semibold text-[#0B1F54]">
                                            ৳{service.price}
                                        </span>

                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {service.serviceName}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Duration: {service.duration} minutes
                                    </div>

                                    <Link
                                        href={`/services/${service._id}`}
                                        className="block w-full bg-[#0B1F54] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#163675]"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="border border-gray-200 bg-white px-5 py-16 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            No Services Available
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            There are currently no active services available.
                            Please check back later.
                        </p>
                    </div>

                )}

            </div>

        </div>
    );
};

export default SalonServicesPage;
