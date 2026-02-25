"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLenis } from "lenis/react"; // 1. Import ini mang

interface Props {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lenis = useLenis(); // 2. Panggil hooknya

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        // 3. Tarik ke atas dulu secepat kilat (0 = koordinat paling atas)
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());

        // Tetap scroll: false karena kita udah handle manual pake Lenis
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-16 mb-10">
            <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-2 px-4 h-10 border-2 border-gray-200 rounded-lg font-bold text-xs uppercase disabled:opacity-30 hover:bg-gray-100 transition-all"
            >
                <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-2
              ${currentPage === i + 1 ? "bg-[#232321] text-white border-[#232321]" : "bg-white text-black border-gray-200 hover:bg-gray-100"}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-2 px-4 h-10 border-2 border-gray-200 rounded-lg font-bold text-xs uppercase disabled:opacity-30 hover:bg-gray-100 transition-all"
            >
                Next <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}