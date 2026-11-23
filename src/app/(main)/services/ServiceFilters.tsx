
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ServiceFiltersProps {
    initialSearch: string;
    initialCategory: string;
    initialSort: string;
}

const categories = [
    "Haircut & Styling",
    "Hair Coloring",
    "Hair Treatment",
    "Facial & Skincare",
    "Makeup",
    "Manicure & Pedicure",
    "Spa & Massage",
];

const ServiceFilters = ({
    initialSearch,
    initialCategory,
    initialSort,
}: ServiceFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Keep search input synchronized with URL without useEffect
    const currentSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(currentSearch);

    // Update URL while preserving other query parameters
    const updateURL = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        const query = params.toString();

        router.push(
            query ? `?${query}` : window.location.pathname,
            { scroll: false }
        );
    };

    // Search services
    const handleSearch = (value: string) => {
        setSearch(value);

        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }

        const query = params.toString();

        router.replace(
            query ? `?${query}` : window.location.pathname,
            { scroll: false }
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        router.push(window.location.pathname, {
            scroll: false,
        });
    };

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div>
                <label
                    htmlFor="service-search"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                >
                    Search Services
                </label>

                <input
                    id="service-search"
                    type="search"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by service name..."
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B1F54]"
                />
            </div>

            {/* Category Filter */}
            <div>
                <label
                    htmlFor="service-category"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                >
                    Category
                </label>

                <select
                    id="service-category"
                    value={initialCategory}
                    onChange={(e) =>
                        updateURL("category", e.target.value)
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B1F54]"
                >
                    <option value="">All Categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Sorting */}
            <div>
                <label
                    htmlFor="service-sort"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                >
                    Sort by Price
                </label>

                <select
                    id="service-sort"
                    value={initialSort}
                    onChange={(e) =>
                        updateURL("sort", e.target.value)
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B1F54]"
                >
                    <option value="">Default</option>
                    <option value="price-asc">
                        Price: Low to High
                    </option>
                    <option value="price-desc">
                        Price: High to Low
                    </option>
                </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
                <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full bg-[#0B1F54] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#163675]"
                >
                    Clear Filters
                </button>
            </div>

        </div>
    );
};

export default ServiceFilters;
