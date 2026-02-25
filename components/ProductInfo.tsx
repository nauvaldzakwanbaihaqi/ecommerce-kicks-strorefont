"use client";

import { useState, useTransition } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/app/action"; // addToCart kita hapus, wishlist biarin dulu
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    brand: string | null;
}

interface ProductInfoProps {
    product: Product;
    isWishlisted: boolean;
}

export default function ProductInfo({ product, isWishlisted }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // 1. UPDATE LOGIC ADD TO CART MANG!
    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Pilih size dulu mang! 👟", {
                description: "Jangan buru-buru, pastiin ukurannya pas."
            });
            return;
        }

        startTransition(async () => {
            try {
                // Nembak API Pelayan yang udah kita bikin kemaren
                const res = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: product.id,
                        size: selectedSize,
                        quantity: 1
                    })
                });

                const data = await res.json();

                // Kalau pelayannya bilang "Belum Login!" (Status 401)
                if (res.status === 401) {
                    toast.error("Eits, login dulu mang! 🛑", {
                        description: "Biar keranjangnya nggak ketuker sama orang lain."
                    });
                    router.push("/login"); // Tendang ke halaman login!
                    return;
                }

                if (!res.ok) {
                    throw new Error(data.error || "Gagal masuk keranjang");
                }

                toast.success("Berhasil masuk keranjang! 🛒", {
                    description: `${product.name} (Size ${selectedSize}) siap bungkus.`,
                });
                
                // Refresh biar angka di icon ShoppingBag Navbar otomatis nambah!
                router.refresh(); 
            } catch (error: any) {
                toast.error(error.message || "Gagal masuk keranjang, coba lagi!");
            }
        });
    };

    // 2. UPDATE LOGIC BUY NOW JUGA MANG!
    const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectedSize) {
            toast.error("Pilih size dulu mang! 👟");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: product.id,
                        size: selectedSize,
                        quantity: 1
                    })
                });

                if (res.status === 401) {
                    toast.error("Eits, login dulu mang! 🛑");
                    router.push("/login");
                    return;
                }

                if (!res.ok) throw new Error("Gagal proses beli langsung");

                toast.info("Otw keranjang belanja...", { duration: 1000 });
                router.push("/cart"); // Diarahin ke cart aja dulu biar aman
                router.refresh();
            } catch {
                toast.error("Gagal proses beli langsung!");
            }
        });
    };

    return (
        <div className="lg:col-span-5 space-y-8">
            <div>
                <span className="bg-[#4A69E2] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase">New Release</span>
                <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mt-4 tracking-tighter">
                    {product.name}
                </h1>
                <p className="text-[#4A69E2] text-2xl font-black mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase text-sm">Size</h4>
                    <span className="text-xs font-bold border-b border-black cursor-pointer uppercase">Size Chart</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {[38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`py-3 text-sm font-bold rounded-xl border transition-all
                                ${selectedSize === size
                                    ? 'bg-[#232321] text-white border-black shadow-lg scale-105'
                                    : 'bg-white hover:bg-gray-100'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isPending}
                    className="flex-1 bg-[#232321] hover:bg-black text-white h-14 rounded-xl font-bold uppercase disabled:opacity-70 transition-all active:scale-95"
                >
                    <ShoppingBag size={20} className="mr-2" />
                    {isPending ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => {
                        startTransition(async () => {
                            await toggleWishlist(product.id);
                            toast(isWishlisted ? "Dihapus dari wishlist" : "Masuk wishlist! ❤️");
                        });
                    }}
                    className={`w-14 h-14 rounded-xl border-2 p-0 flex items-center justify-center transition-all active:scale-90
                        ${isWishlisted
                            ? 'bg-black border-black text-white'
                            : 'border-[#232321] hover:bg-gray-100'}`}
                >
                    <Heart size={24} fill={isWishlisted ? "white" : "none"} />
                </Button>
            </div>

            <Button
                type="button"
                onClick={handleBuyNow}
                disabled={isPending}
                className="w-full bg-[#4A69E2] hover:bg-[#3b55c5] text-white h-14 rounded-xl font-bold uppercase transition-all active:scale-95 shadow-md"
            >
                {isPending ? "Processing..." : "Buy it now"}
            </Button>

            <div className="pt-6 border-t border-gray-300 space-y-4">
                <h4 className="font-bold uppercase text-sm">About the product</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
        </div>
    );
}