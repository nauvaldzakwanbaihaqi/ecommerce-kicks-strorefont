"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPageUI() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                toast.error("Login failed: Invalid email or password");
            } else {
                toast.success("Login successful!");

                router.refresh()
                
                // Get session to check user role for redirection
                const session = await getSession();
                
                if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }


        } catch {
            setError("An error occurred during login");
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#E7E7E3] flex items-center justify-center px-4 py-10">
            <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10">

                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase mb-2">Login</h1>
                        <Link href="#" className="text-sm font-bold underline uppercase tracking-tight">
                            Forgot your password?
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-4 bg-[#D1D1D1]/20 border-2 border-transparent rounded-xl focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-500 font-bold"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-4 bg-[#D1D1D1]/20 border-2 border-transparent rounded-xl focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-500 font-bold"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#232321] text-white p-5 rounded-xl font-black uppercase flex items-center justify-between hover:bg-black transition-all group disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? "Processing..." : "Email Login"}</span>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>

                        <p className="text-center font-bold text-sm uppercase">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline hover:text-gray-600 transition-colors">
                                Register here
                            </Link>
                        </p>
                    </form>

                    <div className="grid grid-cols-3 gap-4">
                        {['google', 'apple', 'facebook'].map((brand) => (
                            <button key={brand} className="flex items-center justify-center p-4 border-2 border-black/10 rounded-xl hover:bg-white transition-all shadow-sm">
                                <Image src={`/icons/${brand}.svg`} alt={brand} className="w-6 h-6" width={24} height={24} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-white p-8 md:p-12 rounded-[40px] shadow-sm flex flex-col justify-between">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black uppercase leading-tight">
                            Join Kicks Club Get Rewarded Today.
                        </h2>
                        <p className="text-gray-500 font-bold text-sm leading-relaxed">
                            Sign up today and receive immediate access to Member benefits.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="w-full bg-[#232321] text-white p-5 rounded-xl font-black uppercase flex items-center justify-between hover:bg-black transition-all group mt-10"
                    >
                        <span>Join The Club</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
