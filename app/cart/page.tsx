import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma"; // 👈 HAPUS USER_ID BOHONGAN DARI SINI
import CartItemCard from "@/components/CartItemCards";
import Image from "next/image";
import { getServerSession } from "next-auth"; // 👈 1. IMPORT SATPAM NEXTAUTH
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

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

interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
}

export default async function CartPage() {
    // 2. CEK SIAPA YANG LAGI LOGIN
    const session = await getServerSession();

    // Kalau belum login, lempar aja ke halaman login!
    if (!session?.user?.email) {
        redirect("/login");
    }

    // 3. CARI ID USER ASLI DI DATABASE BERDASARKAN EMAIL LOGIN
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!currentUser) {
        redirect("/login");
    }

    // 4. GET DATA KERANJANG PAKE ID USER ASLI! 🔥
    const cart = await prisma.cart.findUnique({
        where: { userId: currentUser.id }, // 👈 GANTI PAKE currentUser.id
        include: {
            items: {
                orderBy: { createdAt: 'desc' },
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    images: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }) as Cart | null;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10">
                <h1 className="text-4xl font-black uppercase mb-4 text-black">Bag is Empty</h1>
                <p className="text-gray-500 mb-8">Belum ada sepatunya!</p>
                <Link href="/products">
                    <Button className="bg-black text-white px-8 h-14 rounded-xl font-bold uppercase">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    // 2. GET REKOMENDASI (RANDOM 4 BIJI)
    const randomRecommendations = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Product" ORDER BY RANDOM() LIMIT 4
    `;
    const recIds = randomRecommendations.map(r => r.id);
    const recommendations = await prisma.product.findMany({
        where: { id: { in: recIds } },
        include: { images: true }
    }) as Product[];

    // 3. HITUNG TOTAL
    const subtotal = (cart?.items || []).reduce((total: number, item: CartItem) => {
        return total + (item.quantity * item.variant.product.price);
    }, 0);

    const deliveryFee = subtotal > 0 ? 50000 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="max-w-11/12 mx-auto min-h-screen pb-20">

            {/* HEADER SIMPLE */}
            <div className="px-4 md:px-10 pt-8 mb-8">
                <h1 className="text-3xl font-black uppercase">Your Bag</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Items in your bag not reserved - check out now to make them yours.
                </p>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* KOLOM KIRI: LIST ITEM */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.items.map((item: CartItem) => (
                            <CartItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* KOLOM KANAN: ORDER SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[20px] border border-gray-200 sticky top-10">
                            <h3 className="text-2xl font-black uppercase mb-6">Order Summary</h3>

                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>{cart?.items.length || 0} ITEM</span>
                                    <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="font-bold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sales Tax</span>
                                    <span>-</span>
                                </div>

                                <div className="border-t space-y-4 pt-4 mt-4 flex justify-between text-xl font-black text-black">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button
                                    className="w-full bg-[#232321] hover:bg-black text-white h-14 rounded-xl font-bold uppercase flex items-center justify-between px-6"
                                    disabled={!cart || cart?.items?.length === 0}
                                >
                                    <span>Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <div className="mt-4">
                                <span className="text-xs font-bold underline cursor-pointer hover:text-blue-600">Use a promo code</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: YOU MAY ALSO LIKE */}
                <div className="mt-24">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black uppercase">You may also like</h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 bg-[#E7E7E3] hover:bg-black hover:text-white rounded-lg flex items-center justify-center transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="w-10 h-10 bg-[#232321] text-white rounded-lg flex items-center justify-center">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {recommendations.map((rec: Product) => (
                            <div key={rec.id} className="bg-white p-4 rounded-[24px] border border-gray-100 group cursor-pointer">
                                <div className="aspect-square bg-[#F4F4F4] rounded-[16px] relative flex items-center justify-center mb-4">
                                    <span className="absolute top-3 left-3 bg-[#4A69E2] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">New</span>

                                    <Image
                                        src={rec.images[0]?.url || "/placeholder.png"}
                                        alt={rec.name}
                                        width={200}
                                        height={200}
                                        className="object-contain transition-transform group-hover:scale-120"
                                    />
                                </div>
                                <h3 className="font-bold uppercase text-sm leading-tight mb-2 min-h-[40px]">{rec.name}</h3>
                                <Link href={`/product/${rec.id}`}>
                                    <Button className="w-full bg-[#232321] text-white text-xs font-bold uppercase py-3 rounded-lg">
                                        View Product - <span className="text-[#FFA52F]">Rp {rec.price.toLocaleString('id-ID')}</span>
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}