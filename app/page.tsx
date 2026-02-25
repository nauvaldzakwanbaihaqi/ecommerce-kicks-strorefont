// app/page.tsx
import { Suspense } from "react";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ReviewSection from "@/components/ReviewSection";
import ProductSkeleton from "@/components/ProductSkeleton";
import HomeProductContainer from "@/components/HomeProductContainer";

export default function Home() {
  return (
    <div className="px-3 md:px-10 py-6 space-y-12 md:space-y-16 lg:px-0">
      {/* 1. Hero muncul instan tanpa nunggu database */}
      <Hero />

      {/* --- SECTION PRODUK RANDOM DENGAN SUSPENSE --- */}
      <section className="px-3 md:px-10">
        {/* 2. Selama nunggu 4 produk acak, nampilin 4 skeleton dulu */}
        <Suspense fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        }>
          <HomeProductContainer />
        </Suspense>
      </section>

      {/* 3. Section lainnya juga muncul bareng Hero */}
      <CategorySection />
      <ReviewSection />
    </div>
  );
}