"use client";
import { motion } from "framer-motion";

export default function AnimatedWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Mulai dari transparan & agak ke bawah
            animate={{ opacity: 1, y: 0 }}   // Berubah jadi muncul & ke posisi asli
            transition={{ duration: 0.6, ease: "easeOut" }} // Durasi animasi
        >
            {children}
        </motion.div>
    );
}