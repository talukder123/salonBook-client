
const ServiceSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse overflow-hidden border border-gray-200 bg-white"
                >
                    {/* Image Skeleton */}
                    <div className="h-56 w-full bg-gray-200" />

                    <div className="space-y-4 p-5">

                        {/* Category and Price */}
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-28 bg-gray-200" />
                            <div className="h-5 w-16 bg-gray-200" />
                        </div>

                        {/* Service Name */}
                        <div className="h-6 w-3/4 bg-gray-200" />

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200" />
                            <div className="h-4 w-2/3 bg-gray-200" />
                        </div>

                        {/* Duration */}
                        <div className="h-4 w-32 bg-gray-200" />

                        {/* Button */}
                        <div className="h-11 w-full bg-gray-200" />

                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceSkeleton;
