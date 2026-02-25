import { Suspense } from "react";
import PromoBanner from "@/components/PromoBanner";
import ProductContainer from "@/components/ProductContainer";
import ProductSkeleton from "@/components/ProductSkeleton";
import FilterSidebar from "@/components/FilterSidebar";

export const metadata = {
    title: "All Products",
};

// 1. INI BIANG KEROKNYA: "category" harus didaftarin di sini mang!
interface SearchParams {
    category?: string; // <--- Udah gue tambahin di sini!
    brand?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
}

interface ListingPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ListingPage({ searchParams }: ListingPageProps) {
    // Di Next.js 15, searchParams wajib di-await
    const params = await searchParams;

    return (
        <div className="max-w-[1440px] mx-auto px-3 md:px-10 py-6 md:py-10">
            <PromoBanner />

            <div className="flex flex-col lg:flex-row gap-6 md:gap-10 mt-12 md:mt-16">
                {/* params dari URL dikirim ke Sidebar buat filter */}
                <FilterSidebar searchParams={searchParams} />

                <main className="flex-1 min-w-0">
                    <Suspense fallback={
                        <div className="space-y-6 md:space-y-8">
                            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md" />
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    }>
                        {/* 2. Sekarang params.category udah ikut ke-passing ke ProductContainer */}
                        <ProductContainer searchParams={params} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}