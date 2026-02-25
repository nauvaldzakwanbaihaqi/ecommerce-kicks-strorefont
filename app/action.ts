"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 🔥 1. BIKIN FUNGSI BANTUAN BUAT NGAMBIL ID USER YANG LOGIN
// Biar kita gak nulis ulang kodingan getServerSession berkali-kali mang!
async function getCurrentUserId() {
    const session = await getServerSession();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    return user?.id || null;
}

type CheckoutForm = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    deliveryFee: number;
}

// ==========================================
// 💳 PLACE ORDER / CHECKOUT
// ==========================================
export async function placeOrder(formData: CheckoutForm) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Login dulu mang biar bisa checkout!");

    const cart = await prisma.cart.findUnique({
        where: { userId: userId },
        include: {
            items: {
                include: { variant: { include: { product: true } } }
            }
        }
    });

    if (!cart || cart.items.length === 0) {
        throw new Error("Keranjang kosong mang, mau bayar angin? 😂");
    }

    const subtotal = cart.items.reduce((total, item) => {
        return total + (item.quantity * item.variant.product.price);
    }, 0);

    const grandTotal = subtotal + formData.deliveryFee;

    const newOrder = await prisma.$transaction(async (tx) => {
        const newAddress = await tx.shippingAddress.create({
            data: {
                userId: userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                phone: formData.phone,
            }
        });

        const order = await tx.order.create({
            data: {
                userId: userId,
                totalPrice: grandTotal,
                status: "PENDING",
                shippingAddressId: newAddress.id,
                items: {
                    create: cart.items.map((item) => ({
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                        price: item.variant.product.price
                    }))
                }
            }
        });

        await tx.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        return order;
    });

    revalidatePath("/", "layout");
    revalidatePath("/cart");

    redirect(`/order-success/${newOrder.id}`);
}

// ==========================================
// 🛒 ADD TO CART
// ==========================================
export async function addToCart(productId: string, size: number) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Eits, login dulu mang!");

    const variant = await prisma.productVariant.findFirst({
        where: { productId, size }
    });

    if (!variant) throw new Error("Varian size gak ketemu!");

    const cart = await prisma.cart.upsert({
        where: { userId: userId },
        create: { userId: userId },
        update: {}
    });

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productVariantId: {
                cartId: cart.id,
                productVariantId: variant.id
            }
        }
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + 1 }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productVariantId: variant.id,
                quantity: 1
            }
        });
    }

    revalidatePath("/", "layout");
}

// ==========================================
// ❤️ WISHLIST / LOVE
// ==========================================
export async function toggleWishlist(productId: string) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Login dulu mang buat nyimpen ke wishlist!");

    const wishlist = await prisma.wishlist.upsert({
        where: { userId: userId },
        create: { userId: userId },
        update: {},
    });

    const existingItem = await prisma.wishlistItem.findFirst({
        where: { wishlistId: wishlist.id, productId }
    });

    if (existingItem) {
        await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
    } else {
        await prisma.wishlistItem.create({
            data: { wishlistId: wishlist.id, productId }
        });
    }

    revalidatePath(`/product/${productId}`);
    revalidatePath('/wishlist');
    revalidatePath("/", "layout");
}

// ==========================================
// 🗑️ HAPUS & UPDATE ITEM (BIAR SYNC)
// ==========================================
export async function deleteCartItem(itemId: string) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/", "layout");
}

export async function updateItemQuantity(itemId: string, newQuantity: number) {
    await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: newQuantity }
    });
    revalidatePath("/", "layout");
}