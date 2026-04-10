import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Receipt, Package, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id: id },
        include: {
            shipping: true,
            items: {
                include: {
                    variant: { 
                        include: {
                            product: {
                                include: { images: true, category: true }
                            }
                        }
                    }
                }
            }
        }
    }); 

    if (!order) {
        redirect("/");
    }

    const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const deliveryFee = order.totalPrice - subtotal; 

    return (
        <div className="min-h-screen bg-[#E7E7E3] py-10 px-4 flex justify-center font-sans">
            <div className="max-w-4xl w-full">
                
                {/* HEADER SUCCESS */}
                <div className="bg-white p-10 rounded-t-[40px] flex flex-col items-center text-center border-b-2 border-dashed border-gray-200 relative">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 font-bold mb-6 italic">Mantap mang! Sepatu lu udah masuk antrean pengiriman.</p>
                    
                    <div className="bg-[#ECEEF0] px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Receipt size={20} className="text-gray-500" />
                        <span className="text-[10px] font-mono font-bold text-gray-600 uppercase">ORDER ID: {order.id}</span>
                    </div>

                    <div className="absolute -bottom-4 left-[-10px] w-8 h-8 bg-[#E7E7E3] rounded-full"></div>
                    <div className="absolute -bottom-4 right-[-10px] w-8 h-8 bg-[#E7E7E3] rounded-full"></div>
                </div>

                {/* BODY STRUK */}
                <div className="bg-white p-10 rounded-b-[40px] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 border-t-2 border-dashed border-gray-100">
                    
                    {/* KOLOM KIRI: ALAMAT & DETAIL */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-black uppercase italic mb-4">
                                <MapPin size={20} className="text-[#4A69E2]" /> Shipping Address
                            </h3>
                            <div className="bg-[#F4F4F4] p-5 rounded-2xl text-sm font-medium text-gray-600 space-y-1">
                                <p className="font-bold text-black uppercase text-base">
                                    {order.shipping?.firstName} {order.shipping?.lastName}
                                </p>
                                <p>{order.shipping?.address}</p>
                                <p>{order.shipping?.city}, {order.shipping?.postalCode}</p>
                                <p className="pt-2 font-bold text-black">📞 {order.shipping?.phone}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-black uppercase italic mb-4">
                                <Package size={20} className="text-[#4A69E2]" /> Order Status
                            </h3>
                            <div className="bg-[#F4F4F4] p-5 rounded-2xl">
                                <span className="bg-[#232321] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase">
                                    {order.status}
                                </span>
                                <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase italic">We will notify you when your items are shipped.</p>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: ITEM & TOTAL */}
                    <div>
                        <h3 className="text-lg font-black uppercase italic mb-4">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                            {order.items.map((item: any) => {
                                const product = item.variant?.product;
                                const size = item.variant?.size;

                                return (
                                    <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4">
                                        <div className="w-16 h-16 bg-[#ECEEF0] rounded-xl flex items-center justify-center p-2 shrink-0">
                                            <Image 
                                                src={product?.images?.[0]?.url || "/placeholder.png"} 
                                                alt={product?.name || "Shoe"} 
                                                width={50} height={50} className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold uppercase text-[10px] leading-tight">{product?.name || "Unknown Product"}</p>
                                            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">SIZE {size || "-"} | QTY: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-xs text-[#4A69E2]">Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-3 text-sm font-bold text-gray-500 bg-[#F4F4F4] p-5 rounded-2xl">
                            <div className="flex justify-between text-xs">
                                <span>Subtotal</span>
                                <span className="text-black">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Delivery Fee</span>
                                <span className="text-black uppercase">
                                    {deliveryFee <= 0 ? "FREE" : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
                                </span>
                            </div>
                            <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-xl font-black italic text-black">
                                <span>TOTAL</span>
                                <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM ACTION */}
                <div className="mt-8 flex justify-center">
                    <Button asChild className="bg-[#232321] hover:bg-black text-white h-16 px-10 rounded-2xl font-bold uppercase text-lg transition-transform active:scale-95 shadow-xl group">
                        <Link href="/products" className="flex items-center gap-2">
                            Continue Shopping <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

            </div>
        </div>
    );
}