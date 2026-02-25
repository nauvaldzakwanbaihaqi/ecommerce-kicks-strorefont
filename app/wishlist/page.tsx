import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma, { USER_ID } from "@/lib/prisma";
import WishlistItemCard from "@/components/WishlistItemCard";

export const dynamic = 'force-dynamic';

interface WishlistItem {
    id: string;
    productId: string;
    createdAt: Date;
    product: {
        id: string;
        name: string;
        price: number;
        images: { url: string }[];
    };
}

interface Wishlist {
    id: string;
    userId: string;
    items: WishlistItem[];
}

export default async function WishlistPage() {
    const wishlist = await prisma.wishlist.findFirst({
        where: { userId: USER_ID },
        include: {
            items: {
                orderBy: { createdAt: 'desc' },
                include: {
                    product: {
                        include: { images: true }
                    }
                }
            }
        }
    }) as Wishlist | null;

    const items = wishlist?.items || [];

    return (
        <div className="max-w-11/12 mx-auto min-h-screen pt-10 pb-20 px-4 md:px-10">
            <div className="max-w-[1440px] mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center">
                        <Heart size={24} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Your Wishlist</h1>
                        <p className="text-gray-500 text-sm">{items.length} items saved for later</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-[32px] border border-gray-100 p-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <Heart size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold uppercase">It&apos;s empty here</h2>
                        <p className="text-gray-400 max-w-xs">
                            You haven&apos;t saved any sneakers yet. Go find your favorite pair!
                        </p>
                        <Link href="/products">
                            <Button className="mt-4 bg-[#232321] px-8 rounded-xl font-bold uppercase">
                                Browse Sneakers
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <WishlistItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
