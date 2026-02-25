import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        // 1. TANYA SATPAM DULU: "Orang ini udah login belum?"
        const session = await getServerSession(authOptions);

        // Kalau belum login, langsung tendang!
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Lu belum login mang! Login dulu gih." },
                { status: 401 }
            );
        }

        // 2. TANGKEP PESENAN DARI TOMBOL FRONTEND
        const body = await req.json();
        const { productId, size, quantity = 1 } = body;

        if (!productId || !size) {
            return NextResponse.json({ error: "Pilih ukuran sepatunya dulu boss!" }, { status: 400 });
        }

        // 3. CARI ID USER BERDASARKAN EMAIL LOGIN-NYA
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "Akun lu ga ketemu di database!" }, { status: 404 });
        }

        // ==========================================
        // 🔥 FIX RELASI PRISMA-NYA DI SINI MANG!
        // ==========================================

        // 4. CARI VARIAN SEPATU DULU (Berdasarkan ID Sepatu & Ukurannya)
        const variant = await prisma.productVariant.findFirst({
            where: {
                productId: productId,
                size: size
            }
        });

        // Kalau ternyata ukurannya ga ada di database, tolak!
        if (!variant) {
            return NextResponse.json({ error: "Ukuran ini lagi kosong atau ga ada mang!" }, { status: 404 });
        }

        // 5. CARI KERANJANG SI USER
        let cart = await prisma.cart.findUnique({
            where: { userId: user.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id }
            });
        }

        // 6. CEK & MASUKIN KE CART ITEM (Pake productVariantId, BUKAN productId!)
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                // Kita pake index unik yang lu bikin (@@unique([cartId, productVariantId]))
                cartId_productVariantId: {
                    cartId: cart.id,
                    productVariantId: variant.id
                }
            }
        });

        if (existingItem) {
            // Kalau udah ada di keranjang, tambahin aja jumlahnya
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            // Kalau belum ada, masukin varian baru ke keranjang
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productVariantId: variant.id, // INI KUNCINYA MANG!
                    quantity: quantity
                }
            });
        }

        // 7. KASIH JEMPOL KE FRONTEND (Berhasil!)
        return NextResponse.json(
            { message: "Sepatu berhasil masuk keranjang!" },
            { status: 200 }
        );

    } catch (error) {
        console.error("CART_ERROR:", error);
        return NextResponse.json({ error: "Waduh, servernya lagi error mang!" }, { status: 500 });
    }
}