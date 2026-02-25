// components/ProductSkeleton.tsx
export default function ProductSkeleton() {
    return (
        <div className="flex flex-col space-y-4 animate-pulse">
            {/* Image Box */}
            <div className="aspect-square bg-gray-200 rounded-[32px]" />
            {/* Text Lines */}
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded" />
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
            </div>
            {/* Button Box */}
            <div className="h-14 w-full bg-gray-100 rounded-xl" />
        </div>
    );
}