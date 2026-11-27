
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IService } from "../../../type/service";

interface CategoryInfo {
    category: string;
    image: string;
    count: number;
}

const SalonServiceCategories = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch service categories");
    }

    const data = await res.json();

    const allServices: IService[] = Array.isArray(data)
        ? data
        : data.services ?? [];

    // Get active services only
    const activeServices = allServices.filter(
        (service) => service.status === "active"
    );

    // Group services by category
    const categoryMap = new Map<string, CategoryInfo>();

    activeServices.forEach((service) => {
        const existing = categoryMap.get(service.category);

        if (existing) {
            existing.count += 1;

            if (!existing.image && service.image) {
                existing.image = service.image;
            }
        } else {
            categoryMap.set(service.category, {
                category: service.category,
                image: service.image || "",
                count: 1,
            });
        }
    });

    const categories = Array.from(categoryMap.values());

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="bg-[#F7F8FC] px-4 py-16 md:px-8 md:py-20 lg:px-16">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="mb-12 text-center">
                    <span className="inline-block border border-[#0B1F54]/15 bg-[#0B1F54]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0B1F54]">
                        Explore Our Categories
                    </span>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                        Discover Services by Category
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                        From hair styling to skincare, explore our
                        professional salon services and find the
                        perfect treatment for yourself.
                    </p>

                    <div className="mx-auto mt-6 h-1 w-16 bg-[#0B1F54]" />
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((item) => (
                        <Link
                            key={item.category}
                            href={`/services?category=${encodeURIComponent(item.category)}`}
                            className="group overflow-hidden border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#0B1F54] hover:shadow-xl hover:shadow-[#0B1F54]/10"
                        >
                            {/* Image */}
                            <div className="relative h-60 overflow-hidden bg-gray-100">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.category}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                        No Image Available
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#071633]/80 via-transparent to-transparent" />

                                <div className="absolute bottom-4 left-5">
                                    <span className="border border-white/30 bg-[#0B1F54]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                                        Salon Category
                                    </span>
                                </div>

                                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/50 bg-white/15 text-white transition duration-300 group-hover:bg-[#0B1F54]">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex items-center justify-between gap-3 p-5">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0B1F54]">
                                        {item.category}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {item.count} {item.count === 1 ? "Service Available" : "Services Available"}
                                    </p>
                                </div>

                                <span className="shrink-0 text-sm font-bold text-[#0B1F54] transition-transform group-hover:translate-x-1">
                                    Explore
                                </span>
                            </div>

                            <div className="h-1 w-0 bg-[#0B1F54] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SalonServiceCategories;
