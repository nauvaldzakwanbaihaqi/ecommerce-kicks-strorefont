"use client";

import { useState, useEffect } from "react";
import { Menu, Search, Heart, ShoppingBag, ChevronDown, User } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useSession, signOut } from "next-auth/react"; 
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({ cartCountElement }: { cartCountElement: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // 3. Panggil satpam buat ngecek status
    const { data: session, status } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-20" />;

    return (
        <>
            <nav className="relative max-w-[91%] mx-auto mt-7 w-full p-4 md:px-10 bg-[#fafafa] flex items-center justify-between rounded-2xl top-0 z-50 shadow-sm">
                
                {/* 1. KIRI: Hamburger & Full Menu */}
                <div className="flex-1 flex items-center justify-start">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors relative z-60"
                    >
                        <Menu size={28} className="text-[#1a1a1a]" />
                    </button>

                    <div className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-tight ml-4">
                        <Link href="/products" className="hover:opacity-70 transition">
                            New Drops <span className="text-orange-500 text-xs">🔥</span>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 outline-none hover:opacity-70 transition">
                                Brand <ChevronDown size={14} strokeWidth={3} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 rounded-xl mt-2 font-bold uppercase">
                                <DropdownMenuLabel className="text-[10px] opacity-50">Top Brands</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/products?brand=Nike">Nike</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/products?brand=Adidas">Adidas</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/products?brand=Jordan">Jordan</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/products?brand=Puma">Puma</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 outline-none hover:opacity-70 transition">
                                Categories <ChevronDown size={14} strokeWidth={3} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 rounded-xl mt-2 font-bold uppercase">
                                <DropdownMenuLabel className="text-[10px] opacity-50">Lifestyle & Sport</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/products?category=lifestyle">Lifestyle</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/products?category=basketball">Basketball</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/products?category=running">Running</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 2. TENGAH: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                    <Link href='/' className="pointer-events-auto">
                        <Image 
                            src='/Logo/Kicks.svg' 
                            alt='Logo' 
                            width={110} 
                            height={30} 
                            className="w-[85px] sm:w-[100px] md:w-[110px]" 
                            priority 
                        />
                    </Link>
                </div>

                {/* 3. KANAN: Icons & Auth Logic */}
                <div className="flex-1 flex items-center justify-end">
                    <div className="hidden lg:flex items-center gap-5">
                        <Search className="w-6 h-6 cursor-pointer hover:text-gray-500 transition" />
                        
                        <Link href="/wishlist">
                            <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
                        </Link>

                        {/* --- LOGIC LOGIN/LOGOUT DIMULAI DI SINI --- */}
                        {status === "loading" ? (
                            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                        ) : status === "authenticated" ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center outline-none hover:opacity-70 transition">
                                    <div className="bg-[#1a1a1a] text-white p-1 rounded-full">
                                        <User className="w-5 h-5" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl mt-2 font-bold uppercase">
                                    <DropdownMenuLabel className="text-[10px] opacity-50">
                                        Hi, {session.user?.name}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500 cursor-pointer">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <User className="w-6 h-6 cursor-pointer hover:text-[#FFA52F] transition" />
                            </Link>
                        )}
                        {/* --- LOGIC LOGIN/LOGOUT SELESAI --- */}

                        <Link className="bg-[#FFA52F] rounded-full p-2.5 relative hover:bg-[#ffb655] transition" href="/cart">
                            <ShoppingBag className="w-6 h-6 text-black" />
                            {cartCountElement}
                        </Link>
                    </div>
                    
                    <div className="lg:hidden w-10" />
                </div>
            </nav>

            <MobileMenu 
                isOpen={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
                cartCount={cartCountElement} 
            />
        </>
    );
}