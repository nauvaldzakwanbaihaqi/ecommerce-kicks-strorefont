// components/HomeProductContainer.tsx
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: string;
    name: string;
    price: number;
    brand: string | null;
    images: { url: string }[];
}

export default async function HomeProductContainer() {
    const randomIds = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Product" ORDER BY RANDOM() LIMIT 4
    `;

    const products = await prisma.product.findMany({
        where: {
            id: { in: randomIds.map(p => p.id) }
        },
        include: { images: true }
    }) as Product[];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
