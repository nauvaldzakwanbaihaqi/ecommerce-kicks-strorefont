"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-999">
            {/* Garis Progress Bar Biru Khas Kicks */}
            <motion.div
                className="h-[4px] bg-[#4A69E2] shadow-[0_0_10px_rgba(74,105,226,0.5)]"
                initial={{ width: "0%", opacity: 1 }}
                animate={{ width: "100%", opacity: 0 }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity
                }}
            />
        </div>
    );
}