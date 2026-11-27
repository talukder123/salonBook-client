
import ServiceSkeleton from "@/components/skeletons/ServiceSkeleton";

const ServicesLoading = () => {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-8 lg:px-16">

            {/* Header Skeleton */}
            <div className="mx-auto mb-10 max-w-7xl text-center animate-pulse">
                <div className="mx-auto mb-3 h-4 w-32 bg-gray-200" />

                <div className="mx-auto h-10 w-80 max-w-full bg-gray-200" />

                <div className="mx-auto mt-4 h-4 max-w-xl bg-gray-200" />
            </div>

            <div className="mx-auto max-w-7xl">

                {/* Search and Filter Skeleton */}
                <div className="mb-8 grid grid-cols-1 gap-4 animate-pulse md:grid-cols-3">
                    <div className="h-12 bg-gray-200" />
                    <div className="h-12 bg-gray-200" />
                    <div className="h-12 bg-gray-200" />
                </div>

                {/* Service Cards Skeleton */}
                <ServiceSkeleton />

            </div>
        </div>
    );
};

export default ServicesLoading;
