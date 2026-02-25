"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, ChevronDown, DollarSign } from "lucide-react";

interface FilterSidebarProps {
    searchParams: Promise<{ size?: string; minPrice?: string; maxPrice?: string }>;
}

export default function FilterSidebar({ searchParams: searchParamsPromise }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = use(searchParamsPromise);

    const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
        return searchParams?.size?.split(",").filter(Boolean) || [];
    });

    // State buat nampung ketikan harga dari user
    const [minPrice, setMinPrice] = useState(searchParams?.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(searchParams?.maxPrice || "");

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [sizeExpanded, setSizeExpanded] = useState(true);
    const [priceExpanded, setPriceExpanded] = useState(true); // Toggle buat filter harga

    // Update state harga kalau URL berubah dari luar
    useEffect(() => {
        setMinPrice(searchParams?.minPrice || "");
        setMaxPrice(searchParams?.maxPrice || "");
    }, [searchParams?.minPrice, searchParams?.maxPrice]);

    const handleFilterChange = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        let newSizes = [...selectedSizes];

        if (newSizes.includes(value)) {
            newSizes = newSizes.filter((s) => s !== value);
        } else {
            newSizes.push(value);
        }

        setSelectedSizes(newSizes);

        if (newSizes.length > 0) {
            params.set("size", newSizes.join(","));
        } else {
            params.delete("size");
        }
        
        // Selalu balik ke page 1 kalau filter berubah
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, selectedSizes, pathname, router]);

    // Fungsi khusus buat ngejalanin filter harga
    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        
        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Fungsi reset total (Size & Harga)
    const resetFilters = () => {
        setSelectedSizes([]);
        setMinPrice("");
        setMaxPrice("");
        router.push(pathname, { scroll: false });
    };

    // Itung total filter aktif (Size + MinPrice + MaxPrice)
    const activeFilterCount = selectedSizes.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

    return (
        <>
            {/* --- Mobile Filter Button --- */}
            <div className="lg:hidden sticky top-4 z-40 mb-6">
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="w-full bg-[#fafafa] border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform"
                >
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-[#1a1a1a]" strokeWidth={2.5} />
                        <span className="font-bold uppercase text-sm tracking-tight text-[#1a1a1a]">Filters</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeFilterCount > 0 && (
                            <span className="bg-[#1a1a1a] text-white text-xs font-bold px-2.5 py-1 rounded-full">{activeFilterCount}</span>
                        )}
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                </button>
            </div>

            {/* --- Desktop Sidebar --- */}
            <aside className="hidden lg:block w-64 space-y-10 shrink-0">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Filters</h3>
                    <button onClick={resetFilters} className="text-[10px] font-bold underline uppercase text-gray-400 hover:text-black transition-colors">Reset</button>
                </div>

                {/* Desktop Size Filter */}
                <div className="space-y-6">
                    <p className="font-bold uppercase text-sm tracking-widest">Size</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[38, 39, 40, 41, 42, 43, 44, 45].map((s) => (
                            <label key={s} className="group flex items-center gap-3 cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" checked={selectedSizes.includes(s.toString())} onChange={() => handleFilterChange(s.toString())} className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-black checked:border-black transition-all" />
                                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className={`font-bold text-sm transition-colors ${selectedSizes.includes(s.toString()) ? 'text-black' : 'text-gray-400 group-hover:text-black'}`}>{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Desktop Price Filter */}
                <div className="space-y-6">
                    <p className="font-bold uppercase text-sm tracking-widest">Price (Rp)</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full bg-transparent border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-black transition-colors"
                            />
                            <span className="font-bold text-gray-300">-</span>
                            <input 
                                type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full bg-transparent border-2 border-gray-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <button onClick={applyPriceFilter} className="w-full bg-[#1a1a1a] text-white rounded-xl py-3 font-bold uppercase text-xs tracking-widest hover:bg-[#FFA52F] transition-colors">
                            Apply Price
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- Mobile Filter Drawer --- */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)} />

                        {/* Bottom Sheet */}
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="fixed bottom-0 left-0 right-0 bg-[#fafafa] z-50 lg:hidden rounded-t-[32px] max-h-[85vh] overflow-y-auto flex flex-col">
                            
                            {/* Header Fixed */}
                            <div className="sticky top-0 bg-[#fafafa] z-10 pb-2 rounded-t-[32px]">
                                <div className="flex items-center justify-center pt-4 pb-2"><div className="w-12 h-1.5 bg-gray-300 rounded-full" /></div>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-xl font-black uppercase tracking-tight">Filters</h3>
                                    <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} strokeWidth={2} className="text-[#1a1a1a]" /></button>
                                </div>
                            </div>

                            {/* Filter Content (Scrollable) */}
                            <div className="p-6 space-y-6 pb-32 overflow-y-auto flex-1">
                                
                                {/* Mobile Size Filter */}
                                <div className="border-b border-gray-200 pb-6">
                                    <button onClick={() => setSizeExpanded(!sizeExpanded)} className="w-full flex items-center justify-between py-2">
                                        <p className="font-bold uppercase text-sm tracking-widest">Size</p>
                                        <motion.div animate={{ rotate: sizeExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={20} strokeWidth={2.5} className="text-[#1a1a1a]" /></motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {sizeExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                                <div className="grid grid-cols-4 gap-3 pt-4">
                                                    {[38, 39, 40, 41, 42, 43, 44, 45].map((s) => (
                                                        <label key={s} className="group flex flex-col items-center gap-2 cursor-pointer">
                                                            <div className="relative flex items-center justify-center">
                                                                <input type="checkbox" checked={selectedSizes.includes(s.toString())} onChange={() => handleFilterChange(s.toString())} className="peer appearance-none w-10 h-10 border-2 border-gray-300 rounded-xl checked:bg-black checked:border-black transition-all" />
                                                                <svg className="absolute w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`font-bold text-sm transition-colors ${selectedSizes.includes(s.toString()) ? 'text-black' : 'text-gray-400'}`}>{s}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile Price Filter */}
                                <div className="pb-6">
                                    <button onClick={() => setPriceExpanded(!priceExpanded)} className="w-full flex items-center justify-between py-2">
                                        <p className="font-bold uppercase text-sm tracking-widest">Price (Rp)</p>
                                        <motion.div animate={{ rotate: priceExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={20} strokeWidth={2.5} className="text-[#1a1a1a]" /></motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {priceExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                                <div className="flex flex-col gap-4 pt-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-full">
                                                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm font-bold focus:outline-none focus:border-black transition-colors" />
                                                        </div>
                                                        <span className="font-bold text-gray-300">-</span>
                                                        <div className="relative w-full">
                                                            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm font-bold focus:outline-none focus:border-black transition-colors" />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => { applyPriceFilter(); setMobileFilterOpen(false); }} className="w-full bg-[#1a1a1a] text-white rounded-xl py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#FFA52F] transition-colors">
                                                        Apply Filter
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Reset Button (Fixed di bawah) */}
                            <div className="sticky bottom-0 left-0 right-0 p-6 bg-[#fafafa] border-t border-gray-200 z-10">
                                <button onClick={() => { resetFilters(); setMobileFilterOpen(false); }} className="w-full py-4 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
                                    Reset All Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}