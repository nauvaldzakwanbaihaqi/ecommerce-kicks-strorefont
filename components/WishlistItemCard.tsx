"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/app/action";
import { useTransition } from "react";

interface WishlistItem {
    id: string;
    productId: string;
    product: {
        id: string;
        name: string;
        price: number;
        images: { url: string }[];
    };
}

interface WishlistItemCardProps {
    item: WishlistItem;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="relative group">
            <button
                disabled={isPending}
                onClick={() => startTransition(() => toggleWishlist(item.productId))}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
            >
                <X size={16} className="text-gray-500 hover:text-red-500" />
            </button>

            <div className="bg-white rounded-[24px] p-4 border border-transparent hover:border-gray-200 transition-all duration-300">
                <div className="aspect-square bg-[#F4F4F4] rounded-[20px] relative flex items-center justify-center mb-4 overflow-hidden">
                    <Image
                        src={item.product.images[0]?.url || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-contain p-6 -rotate-12 group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold uppercase text-lg leading-tight line-clamp-1">
                        {item.product.name}
                    </h3>
                    <p className="text-[#4A69E2] font-black text-lg">
                        Rp {item.product.price.toLocaleString('id-ID')}
                    </p>

                    <div className="pt-2">
                        <Link href={`/product/${item.productId}`}>
                            <Button className="w-full bg-[#232321] hover:bg-black text-white rounded-xl h-12 font-bold uppercase text-xs flex items-center justify-center gap-2">
                                <ShoppingBag size={16} />
                                View Product
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
