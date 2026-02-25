"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Product {
    id: string;
    name: string;
    price: number;
    brand?: string | null;
    images: { url: string }[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className=" max-w-[91%] max-auto flex flex-col h-full space-y-4 group cursor-pointer"
        >
            <div className="relative aspect-square bg-[#ECEEF0] rounded-[32px] overflow-hidden border-4 border-white transition-all group-hover:shadow-xl">
                <div className="absolute top-0 left-0 bg-[#4A69E2] text-white text-[10px] font-bold px-4 py-2 rounded-br-2xl z-10 uppercase">
                    New
                </div>

                <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-120 mix-blend-multiply"
                />
            </div>

            <div className="flex flex-col grow space-y-2 px-2">
                <p className="text-[#4A69E2] font-bold text-xs uppercase">{product.brand}</p>
                <h3 className="text-lg font-black uppercase leading-tight line-clamp-2 min-h-12 sm:min-h-14 sm:text-xl">
                    {product.name}
                </h3>

                <Button
                    asChild
                    className="w-full bg-[#232321] hover:bg-black text-white min-h-[56px] h-auto py-3 rounded-xl text-[10px] sm:text-xs lg:text-[11px] xl:text-[0.9rem] font-bold mt-auto transition-transform active:scale-95 whitespace-normal"
                >
                    <Link
                        href={`/product/${product.id}`}
                        className="flex flex-wrap items-center justify-center gap-x-1 text-center leading-tight"
                    >
                        <span>VIEW PRODUCT -</span>
                        <span className="text-[#FFA52F]">
                            Rp {product.price.toLocaleString('id-ID')}
                        </span>
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
