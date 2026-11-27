

const DashboardSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 bg-gray-200" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="space-y-4 border border-gray-200 p-5"
                    >
                        <div className="h-4 w-28 bg-gray-200" />
                        <div className="h-9 w-20 bg-gray-200" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
