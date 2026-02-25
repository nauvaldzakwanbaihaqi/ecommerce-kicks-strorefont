"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="overflow-hidden px-4 md:px-0">
            {/* 1. Header DO IT RIGHT - Ukuran lebih punchy di Mobile S/M */}
            <div className="relative max-w-[91%] mx-auto my-4 md:my-1 flex flex-col items-center justify-center text-center leading-none">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-[14vw] sm:text-[10vw] md:text-[10vw] lg:text-[14.7vw] font-black text-[#1a1a1a] tracking-tighter"
                >
                    DO IT
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-[#4A69E2]"
                    >
                        {" "}RIGHT
                    </motion.span>
                </motion.h1>
            </div>

            {/* 2. Main Hero Image - Tambah rounded & aspect ratio mobile */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "circOut" }}
                className="relative max-w-[91%] mx-auto w-full aspect-4/5 sm:aspect-square md:aspect-21/9 lg:aspect-video my-4 md:my-10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden flex justify-center group shadow-2xl"
            >
                <Image
                    src='/Image-1.svg'
                    alt='Nike Air Max Hero'
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                {/* Content Overlay - Padding lebih lega buat jempol di HP */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute bottom-6 left-6 md:bottom-12 md:left-12 space-y-3 md:space-y-4 max-w-[80%] md:max-w-xl"
                >
                    <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest italic">Nike product of the year</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black italic uppercase text-white leading-none">
                        NIKE AIR MAX
                    </h2>

                    <p className="text-white/80 text-[11px] md:text-sm lg:text-base font-medium max-w-[250px] md:max-w-sm">
                        Nike introducing the new air max for everyone&apos;s comfort
                    </p>

                    <Link href='/products' className="block w-fit">
                        <Button className="bg-[#5C67F2] hover:bg-[#4a55d4] text-white px-7 py-5 md:px-8 md:py-6 rounded-xl font-bold uppercase tracking-wider text-[11px] md:text-sm transition-all active:scale-90 shadow-lg shadow-indigo-500/30">
                            Shop Now
                        </Button>
                    </Link>
                </motion.div>

                {/* Thumbnail tetap hidden di mobile biar gak berantakan */}
                <div className="hidden md:flex absolute bottom-12 right-12 flex-col gap-4">
                    {[1, 2].map((i, index) => (
                        <motion.div
                            key={i}
                            // 1. ANIMASI DARI KANAN KE KIRI: Mulai dari x: 50 (kanan), gerak ke x: 0 (posisi asli)
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            // 2. DELAY BERURUTAN: Biar munculnya gantian (foto atas dulu, baru foto bawah)
                            transition={{ duration: 0.6, delay: 0.8 + (index * 0.2), ease: "easeOut" }}
                            className="w-32 h-32 rounded-2xl border-2 border-white/30 overflow-hidden"
                        >
                            <Image
                                src={`/Hero/Rectangle ${i}.svg`}
                                alt={`Thumb ${i}`}
                                width={128}
                                height={128}
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 3. Bottom Section - Perbaikan spacing & alignment */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col md:flex-row justify-between max-w-11/12 mx-auto items-start md:items-end py-10 md:py-16 px-2 md:px-0"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase font-black leading-[0.9] tracking-tighter">
                    Don&apos;t miss <br className="hidden sm:block" /> out new drops
                </h1>
                <Link href='/products' className="w-full md:w-auto mt-6 md:mt-0">
                    <Button className="w-full md:w-auto bg-[#5C67F2] hover:bg-[#4a55d4] text-white px-8 py-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-transform active:scale-95 shadow-xl shadow-indigo-500/20">
                        Shop New Drops
                    </Button>
                </Link>
            </motion.div>
        </section>
    );
}