"use client";

import Image from "next/image";
import { Trash2, Heart } from "lucide-react";
import { updateItemQuantity, deleteCartItem } from "@/app/action";
import { useTransition } from "react";

interface CartItem {
    id: string;
    quantity: number;
    variant: {
        id: string;
        size: number;
        color: string | null;
        product: {
            id: string;
            name: string;
            price: number;
            images: { url: string }[];
            category: { name: string } | null;
        };
    };
}

interface CartItemCardProps {
    item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-col md:flex-row gap-6 border border-gray-200 p-6 rounded-[20px] bg-white">
            <div className="w-full md:w-[200px] aspect-square bg-[#F4F4F4] rounded-[20px] relative flex items-center justify-center shrink-0">
                <Image
                    src={item.variant.product.images[0]?.url || "/placeholder.png"}
                    alt={item.variant.product.name}
                    fill
                    className="object-contain p-4 mix-blend-multiply transition-transform hover:scale-105"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold uppercase text-xl tracking-tight">
                            {item.variant.product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4">
                            {item.variant.product.category?.name || "Sneakers"} <br />
                            {item.variant.color || "Standard Color"}
                        </p>

                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-transparent border-none font-bold text-sm pr-6 focus:ring-0 cursor-pointer"
                                    disabled
                                >
                                    <option>Size {item.variant.size}</option>
                                </select>
                                <span className="absolute right-0 top-1 pointer-events-none text-xs">▼</span>
                            </div>

                            <div className="relative">
                                <select
                                    className="appearance-none bg-transparent border-none font-bold text-sm pr-6 focus:ring-0 cursor-pointer"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        startTransition(() => updateItemQuantity(item.id, val));
                                    }}
                                    disabled={isPending}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>Quantity {num}</option>
                                    ))}
                                </select>
                                <span className="absolute right-0 top-1 pointer-events-none text-xs">▼</span>
                            </div>
                        </div>
                    </div>

                    <p className="font-bold text-[#4A69E2] text-lg">
                        Rp {item.variant.product.price.toLocaleString('id-ID')}
                    </p>
                </div>

                <div className="flex gap-4 mt-6">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                        <Heart size={20} />
                    </button>
                    <button
                        onClick={() => startTransition(() => deleteCartItem(item.id))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
