"use client";

import { useState } from "react";
import { placeOrder } from "@/app/action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CheckoutFormProps {
    subtotal?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CheckoutForm({ subtotal }: CheckoutFormProps) {
    const [loading, setLoading] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(50000);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const data = {
            email: formData.get("email") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            address: formData.get("address") as string,
            city: "Default City", // Nanti bisa ditambahin inputnya kalau butuh
            postalCode: "00000",
            phone: formData.get("phone") as string,
            deliveryFee: deliveryFee // 🔥 TAMBAHIN INI BIAR SERVER TAU ONGKIRNYA!
        };

        try {
            await placeOrder(data);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "NEXT_REDIRECT") return;
            toast.error("Gagal order mang! 😭");
        } finally {
            setLoading(false);
        }
    }

    const labelStyle = "text-xl font-bold mb-4 block";
    const inputStyle = "w-full bg-[#F5F5F5] border border-gray-400 rounded-md h-12 px-4 focus:outline-none focus:ring-1 focus:ring-black transition text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <p className="text-sm underline cursor-pointer mb-2">Login and Checkout faster</p>

            <div>
                <h2 className={labelStyle}>Contact Details</h2>
                <p className="text-xs text-gray-500 mb-4">We will use these details to keep you inform about your delivery.</p>
                <input required name="email" type="email" placeholder="Email" className={inputStyle} />
            </div>

            <div>
                <h2 className={labelStyle}>Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input required name="firstName" placeholder="First Name*" className={inputStyle} />
                    <input required name="lastName" placeholder="Last Name*" className={inputStyle} />
                </div>
                <input required name="address" placeholder="Find Delivery Address*" className={inputStyle} />
                <p className="text-[10px] text-gray-400 mt-1 mb-4">Start typing your street address or zip code for suggestion</p>

                <input required name="phone" type="tel" placeholder="Phone Number*" className={inputStyle} />
                <p className="text-[10px] text-gray-400 mt-1">E.g. (123) 456-7890</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold uppercase italic">Delivery Options</h2>
                <div className="space-y-3">
                    <label className={`flex items-center justify-between border-2 p-4 rounded-xl cursor-pointer transition-all ${deliveryFee === 50000 ? 'border-black bg-white' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="delivery" checked={deliveryFee === 50000} onChange={() => setDeliveryFee(50000)} className="w-5 h-5 accent-black" />
                            <div>
                                <p className="font-bold text-sm">Standard Delivery</p>
                                <p className="text-xs text-gray-500">3-5 Working Days</p>
                            </div>
                        </div>
                        <span className="font-bold text-[#4A69E2]">Rp 50.000</span>
                    </label>

                    <label className={`flex items-center justify-between border-2 p-4 rounded-xl cursor-pointer transition-all ${deliveryFee === 0 ? 'border-black bg-white' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="delivery" checked={deliveryFee === 0} onChange={() => setDeliveryFee(0)} className="w-5 h-5 accent-black" />
                            <div>
                                <p className="font-bold text-sm">Collect in store</p>
                                <p className="text-xs text-gray-500">Pay now, collect in store</p>
                            </div>
                        </div>
                        <span className="font-bold">Free</span>
                    </label>
                </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 text-xs font-bold cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                    My billing and delivery information are the same
                </label>
                <label className="flex items-center gap-3 text-xs font-bold cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                    I&apos;m 13+ year old
                </label>
                <label className="flex items-start gap-3 text-xs font-bold cursor-pointer leading-tight">
                    <input type="checkbox" className="w-4 h-4 accent-black mt-0.5" />
                    <span>Also want product updates with our newsletter? <br />
                        <span className="text-gray-400 font-normal">Yes, I&apos;d like to receive emails about exclusive sales and more.</span></span>
                </label>
            </div>

            <Button
                disabled={loading}
                className="w-full bg-[#232321] hover:bg-black text-white h-12 rounded-md font-bold uppercase text-xs tracking-wider"
            >
                {loading ? "PROCESSING..." : "REVIEW AND PAY"}
            </Button>
        </form>
    );
}
