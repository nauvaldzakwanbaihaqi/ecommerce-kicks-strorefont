import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import { getServerSession } from "next-auth"; // 👈 1. IMPORT SATPAM NEXTAUTH

export const metadata = {
    title: "Secure Checkout",
};

export default async function CheckoutPage() {
    // 2. CEK SIAPA YANG LAGI LOGIN
    const session = await getServerSession();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!currentUser) {
        redirect("/login");
    }

    // 3. TARIK DATA KERANJANG PAKE ID USER ASLI! 🔥
    const cart = await prisma.cart.findUnique({
        where: { userId: currentUser.id }, // 👈 GANTI PAKE currentUser.id
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                    images: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!cart || cart.items.length === 0) {
        redirect("/cart"); // Kalau kosong, lempar balik ke cart aja mang
    }

    // 1. HITUNGAN DINAMIS
    const subtotal = cart.items.reduce((total, item) => total + (item.quantity * item.variant.product.price), 0);
    const deliveryFee = 50000;
    const total = subtotal + deliveryFee;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 bg-[#E7E7E3]/30 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* KOLOM KIRI: FORM */}
                <div className="flex-1 w-full">
                    <h1 className="text-4xl font-black uppercase mb-12 tracking-tight">Checkout</h1>
                    {/* 👇 INI DIA KOMPONEN KUNCINYA 👇 */}
                    <CheckoutForm subtotal={subtotal} />
                </div>

                {/* KOLOM KANAN: SUMMARY CARDS */}
                <div className="w-full lg:w-[420px] space-y-8 sticky top-10">

                    {/* ORDER SUMMARY */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm">
                        <h2 className="text-2xl font-black uppercase italic mb-6">Order Summary</h2>
                        <div className="space-y-4 font-bold text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>{cart.items.length} ITEM{cart.items.length > 1 ? 'S' : ''}</span>
                                <span className="text-black">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery</span>
                                <span className="text-black">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Sales Tax</span>
                                <span className="text-black">-</span>
                            </div>
                            <div className="border-t border-dashed pt-6 flex justify-between text-xl font-black italic">
                                <span>TOTAL</span>
                                <span>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* ORDER DETAILS - LOOPING SEMUA ITEM */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm max-h-[500px] overflow-y-auto">
                        <h2 className="text-2xl font-black uppercase italic mb-6">Order Details</h2>
                        <div className="space-y-6">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex gap-5">
                                    <div className="w-24 h-24 bg-[#ECEEF0] rounded-2xl p-2 flex items-center justify-center">
                                        <Image
                                            src={item.variant.product.images[0]?.url || "/placeholder.png"}
                                            alt={item.variant.product.name}
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black uppercase text-sm leading-tight">{item.variant.product.name}</h3>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase">{item.variant.product.category?.name || "Sneakers"}</p>
                                            <p className="text-gray-400 text-xs font-medium">Size {item.variant.size}  |  Quantity {item.quantity}</p>
                                        </div>
                                        <p className="text-[#4A69E2] font-black">Rp {item.variant.product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}