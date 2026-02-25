"use client";

import { ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const lenis = useLenis(); // Ambil akses ke mesin scrollnya

    useEffect(() => {
        if (lenis) {
            // Paksa Lenis reset ke atas tiap pindah rute
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis]);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {children}
        </ReactLenis>
    )
}