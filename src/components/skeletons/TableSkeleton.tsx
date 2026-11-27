
const TableSkeleton = () => {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-10 w-full bg-gray-200" />

            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex gap-4 border-b border-gray-100 py-4"
                >
                    <div className="h-5 flex-1 bg-gray-200" />
                    <div className="h-5 flex-1 bg-gray-200" />
                    <div className="h-5 flex-1 bg-gray-200" />
                    <div className="h-5 flex-1 bg-gray-200" />
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;
