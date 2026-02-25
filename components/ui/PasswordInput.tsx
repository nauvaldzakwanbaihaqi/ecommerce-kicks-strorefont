"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    name?: string;
    placeholder?: string;
    required?: boolean;
}

export default function PasswordInput({ name = "password", placeholder = "Password", required = true }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full group">
            <input
                type={showPassword ? "text" : "password"} // KUNCI UTAMA: Toggle type di sini mang
                name={name}
                placeholder={placeholder}
                required={required}
                className="w-full p-4 bg-transparent border-2 border-black/10 rounded-xl focus:border-black outline-none transition-all placeholder:text-gray-500 font-bold pr-12"
            />

            {/* Tombol Mata di pojok kanan input */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
                {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}