"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// 1. Tambahin field 'img' buat tiap objek banner mang
const banners = [
    {
        title: "Get 30% Off",
        sub: "Limited time only",
        img: "/banner/banner.svg"
    },
    {
        title: "New Season",
        sub: "Check the drops",
        img: "/banner/banner-2.jpg"    
    },
    {
        title: "Lunar New Year",
        sub: "Air Jordan",
        img: "/banner/banner-3.jpeg" 
    }
];

export default function PromoBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[350px] md:h-[450px] rounded-[32px] overflow-hidden relative group">

            {/* --- 1. LAYER BACKGROUND IMAGE --- */}
            {/* Kita pake map biar transisi antar gambarnya halus (cross-fade) */}
            {banners.map((banner, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0
                        ${i === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={banner.img}
                        alt={banner.title}
                        fill // KUNCI UTAMA: Biar gambar ngisi penuh container
                        className="object-cover" // Biar gambar gak gepeng, dicrop proporsional
                        priority={i === 0} // Gambar pertama diload duluan biar cepet
                    />
                    {/* Overlay Gelap di atas tiap gambar biar teks kebaca */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}

            {/* --- 2. LAYER KONTEN TEKS (Z-Index paling tinggi) --- */}
            <div className="absolute inset-0 flex items-center px-10 md:px-20 z-20">
                <div className="text-white space-y-4 max-w-xl transition-all duration-700 transform translate-y-0 group-hover:-translate-y-2">
                    <p className="font-bold uppercase tracking-[0.2em] text-sm text-[#fbbf24]">
                        {banners[index].sub}
                    </p>
                    {/* Judul dengan efek animasi pas ganti slide */}
                    <h2 key={index} className="text-5xl md:text-7xl font-black uppercase leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {banners[index].title}
                    </h2>
                    <button className="bg-[#4A69E2] hover:bg-[#3b54b5] text-white px-8 py-4 rounded-xl font-bold uppercase transition-all mt-4">
                        Shop Now
                    </button>
                </div>
            </div>

            {/* (Gambar sepatu melayang yang lama SUDAH DIHAPUS) */}
        </div>
    );
}