"use client";

import { useState, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthPolicy } from "./AuthPolicy";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPageUI() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(registerUser, null);

    // Trigger toast notifications based on state changes

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
        }
        if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    const isSuccess = !!state?.success;

    return (
        <div className="min-h-screen bg-[#E7E7E3] flex items-center justify-center px-4 py-10">
            <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase mb-2 leading-none">Register</h1>
                        <p className="font-bold text-sm uppercase tracking-tight">Sign up with</p>
                    </div>

                    {isSuccess ? (
                        // SUCCESS STATE - Show 'Go to Login' button
                        <div className="flex flex-col items-center justify-center space-y-6 py-10">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black uppercase">Registration Successful!</h2>
                                <p className="text-gray-500 font-bold text-sm">
                                    Your account has been created successfully.
                                </p>
                            </div>
                            <Link href="/login" className="w-full">
                                <Button className="w-full bg-[#232321] hover:bg-black text-white px-8 py-6 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-all group">
                                    Go to Login
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        // FORM STATE
                        <>
                            <div className="grid grid-cols-3 gap-4">
                                {['google', 'apple', 'facebook'].map((brand) => (
                                    <button
                                        key={brand}
                                        type="button"
                                        className="flex items-center justify-center p-4 border-2 border-black/10 rounded-xl hover:bg-white hover:border-black transition-all shadow-sm group"
                                    >
                                        <Image src={`/icons/${brand}.svg`} alt={brand} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" width={24} height={24} />
                                    </button>
                                ))}
                            </div>

                            <p className="font-black text-center uppercase text-sm my-6">OR</p>

                            <form action={formAction} className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black uppercase">Your Name</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                // 🔥 TAMBAHIN DEFAULT VALUE
                                                defaultValue={state?.fields?.firstName || ""}
                                                className={`w-full p-4 bg-transparent border-2 rounded-xl focus:border-black outline-none font-bold placeholder:text-gray-500 ${state?.errors?.firstName ? 'border-red-500' : 'border-black/10'}`}
                                                required
                                            />
                                            {state?.errors?.firstName?.[0] && <p className="text-red-500 text-[10px] font-black uppercase">{state.errors.firstName[0]}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                // 🔥 TAMBAHIN DEFAULT VALUE
                                                defaultValue={state?.fields?.lastName || ""}
                                                className={`w-full p-4 bg-transparent border-2 rounded-xl focus:border-black outline-none font-bold placeholder:text-gray-500 ${state?.errors?.lastName ? 'border-red-500' : 'border-black/10'}`}
                                                required
                                            />
                                            {state?.errors?.lastName?.[0] && <p className="text-red-500 text-[10px] font-black uppercase">{state.errors.lastName[0]}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-black uppercase">Gender</h3>
                                    <div className="flex gap-6">
                                        {['Male', 'Female'].map((g) => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value={g}
                                                    className="w-5 h-5 accent-black cursor-pointer"
                                                    // 🔥 CEK DEFAULT CHECKED BERDASARKAN PILIHAN SEBELUMNYA
                                                    defaultChecked={state?.fields?.gender ? state.fields.gender === g : g === 'Male'}
                                                />
                                                <span className="font-bold text-sm uppercase group-hover:text-gray-600">{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-black uppercase">Login Details</h3>

                                    <div className="space-y-1">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            // 🔥 TAMBAHIN DEFAULT VALUE
                                            defaultValue={state?.fields?.email || ""}
                                            className={`w-full p-4 bg-transparent border-2 rounded-xl focus:border-black outline-none font-bold placeholder:text-gray-500 ${state?.errors?.email ? 'border-red-500' : 'border-black/10'}`}
                                            required
                                        />
                                        {state?.errors?.email?.[0] && <p className="text-red-500 text-[10px] font-black uppercase">{state.errors.email[0]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                defaultValue={state?.fields?.password || ""}
                                                className={`w-full p-4 bg-transparent border-2 rounded-xl focus:border-black outline-none font-bold pr-12 placeholder:text-gray-500 ${state?.errors?.password ? 'border-red-500' : 'border-black/10'}`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {state?.errors?.password?.[0] && <p className="text-red-500 text-[10px] font-black uppercase">{state.errors.password[0]}</p>}
                                        <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight">
                                            Minimum 8 characters with at least one uppercase, one lowercase, one special character and a number
                                        </p>
                                    </div>
                                </div>

                                <AuthPolicy />

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-[#232321] text-white p-5 rounded-xl font-black uppercase flex items-center justify-between hover:bg-black transition-all group disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <span>{isPending ? "Processing..." : "Register"}</span>
                                    {isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="flex-1 bg-white p-8 md:p-12 rounded-[40px] shadow-sm flex flex-col justify-between h-fit lg:sticky lg:top-10">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black uppercase leading-tight">Join Kicks Club Get Rewarded Today.</h2>
                        <p className="text-gray-500 font-bold text-sm leading-relaxed">
                            As kicks club member you get rewarded with what you love for doing what you love.
                        </p>
                        <ul className="space-y-3 font-bold text-sm uppercase">
                            <li>• Free shipping</li>
                            <li>• A 15% off voucher for your next purchase</li>
                            <li>• Access to Members Only products and sales</li>
                            <li>• Access to adidas Running and Training apps</li>
                            <li>• Special offers and promotions</li>
                        </ul>
                    </div>
                    <button type="button" className="w-full bg-[#232321] text-white p-5 rounded-xl font-black uppercase flex items-center justify-between hover:bg-black transition-all group mt-10">
                        <span>Join The Club</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}
