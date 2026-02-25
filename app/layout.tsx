import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartCount from "@/components/CartCount";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/SmoothScroll";
import { Providers } from "@/components/Providers";

const rubik = Rubik({
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kicks - Shoes eCommerce",
    template: "%s | Kicks",
  },
  description: "Dapatkan sepatu impianmu dengan harga terbaik hanya di Kicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.variable} font-sans antialiased bg-[#e7e7e3]`}
      >
        {/* 2. BUNGKUS SEMUANYA PAKE PROVIDERS DI SINI! */}
        <Providers>
          <SmoothScroll>
            <Navbar cartCountElement={<CartCount />} />

            <main className="min-h-screen">
              {children}
            </main>

            <Footer />
          </SmoothScroll>

          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}