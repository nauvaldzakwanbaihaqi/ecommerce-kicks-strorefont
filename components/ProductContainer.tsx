import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Pagination from "./Pagination";

interface SearchParams {
    category?: string;
    brand?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
}

interface Props {
    searchParams: SearchParams | Promise<SearchParams>;
}

interface Product {
    id: string;
    name: string;
    price: number;
    brand: string | null;
    images: { url: string }[];
}

export default async function ProductContainer({ searchParams }: Props) {
    const params = await searchParams;
    const { category, brand, size, color, minPrice, maxPrice } = params;

    const currentPage = Number(params?.page) || 1;
    const pageSize = 9;
    const skip = (currentPage - 1) * pageSize;

    const sizeArray = size ? size.split(",").map((s: string) => parseInt(s)) : undefined;
    const colorArray = color ? color.split(",") : undefined;
    const minP = minPrice ? parseFloat(minPrice) : undefined;
    const maxP = maxPrice ? parseFloat(maxPrice) : undefined;

    // 1. KITA BIKIN FILTERNYA PELAN-PELAN BIAR TS GAK MARAH
    const whereClause: any = {}; // Pake 'any' sebagai jurus pamungkas anti-error TS

    if (brand) {
        whereClause.brand = { equals: brand, mode: 'insensitive' };
    }

    if (category) {
        whereClause.category = {
            is: {
                // Gue asumsiin nama kolom di tabel Category lu adalah 'name'
                slug: { equals: category, mode: 'insensitive' }
            }
        };;
    }

    if (minP !== undefined || maxP !== undefined) {
        whereClause.price = {};
        if (minP !== undefined) whereClause.price.gte = minP;
        if (maxP !== undefined) whereClause.price.lte = maxP;
    }

    if (sizeArray || colorArray) {
        whereClause.variants = { some: {} };
        if (sizeArray) whereClause.variants.some.size = { in: sizeArray };
        if (colorArray) whereClause.variants.some.color = { in: colorArray };
    }

    // 2. ERROR PROMISE.ALL DIJAMIN ILANG SEKARANG!
    const [totalProducts, rawProducts] = await Promise.all([
        prisma.product.count({ where: whereClause }),
        prisma.product.findMany({
            where: whereClause,
            include: { images: true },
            orderBy: { createdAt: 'desc' },
            take: pageSize,
            skip: skip
        })
    ]);

    // Paksa tipe datanya biar sesuai sama Interface Product lu
    const products = rawProducts as unknown as Product[];

    const totalPages = Math.ceil(totalProducts / pageSize);

    let displayTitle = "All Shoes";
    if (category) {
        displayTitle = `${category} Shoes`;
    } else if (brand) {
        displayTitle = `${brand} Collection`;
    }

    return (
        <>
            <div className="flex justify-between items-end mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-tight tracking-tighter">
                        {displayTitle}
                    </h2>
                    <p className="text-gray-400 font-bold text-xs md:text-sm">
                        {totalProducts} Items Found
                    </p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="py-16 md:py-20 text-center border-2 border-dashed border-gray-200 rounded-[24px] md:rounded-[32px]">
                    <p className="text-lg md:text-xl font-black uppercase italic text-gray-400">
                        Waduh, sepatunya gak ketemu mang! 😭
                    </p>
                    <p className="text-xs font-bold text-gray-300 mt-1 uppercase">
                        Coba ganti filter harganya atau pilih kategori lain.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((p: Product) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination totalPages={totalPages} currentPage={currentPage} />
            )}
        </>
    );
}