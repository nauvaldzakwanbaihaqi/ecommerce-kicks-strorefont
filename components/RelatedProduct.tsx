"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Kita pinjem interface dari halaman utama biar TypeScript-nya gak nangis
interface ProductWithImages {
    id: string;
    name: string;
    price: number;
    description: string | null;
    brand: string | null;
    category: { name: string } | null;
    images: { url: string }[];
}

export default function RelatedProducts({ products }: { products: ProductWithImages[] }) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4; // Menampilkan 4 sepatu per halaman
    
    // Ngitung total halaman berdasarkan jumlah sepatu yang dikirim dari database
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Kalau sepatunya kosong, gak usah nampilin apa-apa
    if (!products || products.length === 0) return null;

    // Logika ganti halaman muter (kalau udah mentok kanan, balik ke awal)
    const handleNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
    const handlePrev = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

    // Motong array sepatu sesuai halaman yang lagi aktif
    const currentProducts = products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="mt-32">
            {/* Header + Tombol Navigasi */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    You may also like
                </h2>
                
                {/* Tombol Next/Prev cuma muncul kalau sepatunya lebih dari 4 (butuh > 1 halaman) */}
                {totalPages > 1 && (
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrev} 
                            className="p-3 bg-[#1a1a1a] text-white rounded-2xl hover:bg-[#FFA52F] hover:scale-105 transition-all active:scale-95"
                        >
                            <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="p-3 bg-[#1a1a1a] text-white rounded-2xl hover:bg-[#FFA52F] hover:scale-105 transition-all active:scale-95"
                        >
                            <ChevronRight size={24} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>

            {/* Grid Sepatu */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {currentProducts.map((rec) => (
                    // Tambahin 'key' animasi sederhana biar kerasa smooth pas ganti halaman
                    <div key={`${currentPage}-${rec.id}`} className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="bg-white rounded-[32px] aspect-square relative p-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden group">
                            <Image
                                src={rec.images[0]?.url || "/shoes-1.svg"}
                                alt={rec.name}
                                fill
                                className="object-contain p-6 transition-transform duration-500 group-hover:scale-110 rounded-5xl"
                            />
                        </div>
                        <h3 className="font-bold uppercase text-lg leading-tight min-h-12">{rec.name}</h3>

                        <Link href={`/product/${rec.id}`}>
                            <Button className="w-full bg-[#232321] hover:bg-black text-white rounded-xl py-6 font-bold uppercase transition-transform active:scale-95">
                                View Product - <span className="text-[#FFA52F]">Rp {rec.price.toLocaleString('id-ID')}</span>
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Indikator Titik (Dots) di bawah */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentPage === i ? "w-8 bg-[#FFA52F]" : "w-2 bg-gray-300 hover:bg-gray-400"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}