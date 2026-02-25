"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    cartCount: ReactNode;
}

export default function MobileMenu({ isOpen, onClose, cartCount }: MobileMenuProps) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [openBrand, setOpenBrand] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);

    useEffect(() => {
        onClose();
        setOpenBrand(false);
        setOpenCategory(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP: Z-index diperbaiki */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 lg:hidden"
                        onClick={onClose}
                    />

                    {/* MENU PANEL: Pake 'fixed inset-y-0 left-0' biar narik mentok atas-bawah! */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#fafafa] z-100 lg:hidden flex flex-col shadow-2xl"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                            <span className="text-2xl font-black uppercase tracking-tighter text-[#1a1a1a]">
                                KICKS
                            </span>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={28} strokeWidth={2.5} className="text-[#1a1a1a]" />
                            </button>
                        </div>

                        {/* ICON QUICK ACTIONS */}
                        <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-200 shrink-0">
                            <Link href="/search" onClick={onClose} className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white shadow-sm rounded-2xl"><Search size={24} /></div>
                                <span className="text-[10px] font-bold uppercase">Search</span>
                            </Link>
                            <Link href="/wishlist" onClick={onClose} className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white shadow-sm rounded-2xl"><Heart size={24} /></div>
                                <span className="text-[10px] font-bold uppercase">Wishlist</span>
                            </Link>
                            <Link href="/cart" onClick={onClose} className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-[#FFA52F]/20 rounded-2xl relative">
                                    <ShoppingBag size={24} className="text-[#FFA52F]" />
                                    <div className="absolute -top-1 -right-1 scale-90">{cartCount}</div>
                                </div>
                                <span className="text-[10px] font-bold uppercase text-[#FFA52F]">Cart</span>
                            </Link>
                        </div>

                        {/* MENU LINKS (Bagian yang bisa di-scroll) */}
                        <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
                            <Link href="/products" onClick={onClose} className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-gray-100 transition-colors">
                                <span className="text-lg font-bold uppercase tracking-tight text-[#1a1a1a]">New Drops</span>
                                <span className="text-sm font-bold text-orange-500">🔥</span>
                            </Link>

                            {/* Dropdown Brand */}
                            <div className="py-2">
                                <button onClick={() => setOpenBrand(!openBrand)} className="w-full flex items-center justify-between py-4 px-3 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-lg font-bold uppercase tracking-tight text-[#1a1a1a]">Brands</span>
                                    <motion.div animate={{ rotate: openBrand ? 180 : 0 }}>
                                        <ChevronDown size={20} strokeWidth={2.5} className="text-[#1a1a1a]" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openBrand && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="pl-4 space-y-1 mt-2">
                                                {["Nike", "Adidas", "Jordan", "Puma"].map((brand) => (
                                                    <Link key={brand} href={`/products?brand=${brand}`} onClick={onClose} className="block py-3 px-3 rounded-lg text-sm font-bold uppercase text-gray-500 hover:bg-gray-100 hover:text-[#1a1a1a]">
                                                        {brand}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dropdown Categories */}
                            <div className="py-2">
                                <button onClick={() => setOpenCategory(!openCategory)} className="w-full flex items-center justify-between py-4 px-3 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-lg font-bold uppercase tracking-tight text-[#1a1a1a]">Categories</span>
                                    <motion.div animate={{ rotate: openCategory ? 180 : 0 }}>
                                        <ChevronDown size={20} strokeWidth={2.5} className="text-[#1a1a1a]" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openCategory && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="pl-4 space-y-1 mt-2">
                                                {[
                                                    { label: "Lifestyle", value: "lifestyle" },
                                                    { label: "Basketball", value: "basketball" },
                                                    { label: "Running", value: "running" }
                                                ].map((cat) => (
                                                    <Link key={cat.value} href={`/products?category=${cat.value}`} onClick={onClose} className="block py-3 px-3 rounded-lg text-sm font-bold uppercase text-gray-500 hover:bg-gray-100 hover:text-[#1a1a1a]">
                                                        {cat.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* FOOTER MENU & AUTH LOGIC (Nempel di bawah layar!) */}
                        <div className="p-6 pt-4 border-t border-gray-200 bg-[#fafafa] shrink-0 mt-auto pb-safe">
                            {status === "loading" ? (
                                <div className="w-full h-14 rounded-xl bg-gray-200 animate-pulse" />
                            ) : status === "authenticated" ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="bg-[#1a1a1a] text-white p-2 rounded-full">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">Logged in as</p>
                                            <p className="text-sm font-black uppercase tracking-tight">{session.user?.name}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { signOut(); onClose(); }} 
                                        className="w-full bg-red-500/10 text-red-600 flex items-center justify-center py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={onClose} className="w-full bg-[#1a1a1a] text-white flex items-center justify-center py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#FFA52F] transition-colors">
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}