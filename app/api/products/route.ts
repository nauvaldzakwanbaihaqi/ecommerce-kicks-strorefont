import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            take: 4,
            include: {
                images: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(products);
    } catch {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
