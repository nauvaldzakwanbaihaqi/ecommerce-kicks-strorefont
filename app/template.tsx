"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react"; // Pakai yang Layout mang!

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useLayoutEffect(() => {
        // Paksa scroll ke 0 secepat kilat
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return (
        <motion.div
            key={pathname}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
}