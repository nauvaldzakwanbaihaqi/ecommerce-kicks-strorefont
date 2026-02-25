import Image from "next/image";
import prisma from "@/lib/prisma";
import ProductInfo from "@/components/ProductInfo";
import RelatedProducts from "@/components/RelatedProduct"; // 👈 1. IMPORT KOMPONEN BARU!

const USER_ID = "user_123_aja_dulu_buat_test";

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }) {
    // ... (kodingan metadata tetap sama) ...
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: id },
        select: { name: true }
    });
    if (!product) return { title: "Product Not Found" };
    return { title: product.name, description: `Beli ${product.name} original hanya di Kicks eCommerce.` };
}

interface ProductWithImages {
    id: string;
    name: string;
    price: number;
    description: string | null;
    brand: string | null;
    category: { name: string } | null;
    images: { url: string }[];
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    
    const product = await prisma.product.findUnique({
        where: { id: id },
        include: { images: true, category: true }
    }) as ProductWithImages | null;

    if (!product) return <div className="p-20 text-center font-bold">Product Not Found!</div>;

    const wishlist = await prisma.wishlist.findUnique({
        where: { userId: USER_ID },
        include: { items: { where: { productId: id } } }
    });

    const isWishlisted = wishlist?.items.length ? true : false;

    // 🔥 2. UBAH JUMLAH TAKE DATABASE 🔥
    // Kita ambil 12 sepatu sekarang biar bisa dibagi jadi 3 halaman (12 / 4)
    const allAvailableProducts = await prisma.product.findMany({
        where: {
            NOT: { id: id }
        },
        include: { images: true, category: true },
        orderBy: { id: 'asc' },
        take: 12 // 👈 GANTI JADI 12 ATAU LEBIH BEBAS MANG!
    }) as unknown as ProductWithImages[];

    return (
        <div className="bg-[#E7E7E3] min-h-screen ">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-10">

                {/* BREADCRUMB */}
                <div className="text-sm font-bold uppercase mb-8 flex gap-2">
                    <span className="text-gray-400">Home</span> /
                    <span className="text-gray-400">Sneakers</span> /
                    <span>{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT: IMAGE GALLERY */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                        {product.images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-[32px] overflow-hidden bg-white">
                                <Image src={img.url} alt={product.name} fill className="object-cover" />
                            </div>
                        ))}
                        {product.images.length < 4 && [...Array(4 - product.images.length)].map((_, i) => (
                            <div key={i} className="relative aspect-square rounded-[32px] overflow-hidden bg-white/50 border-2 border-dashed border-gray-300" />
                        ))}
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <ProductInfo product={product} isWishlisted={isWishlisted} />
                </div>

                {/* 🔥 3. PANGGIL KOMPONEN CLIENT-NYA DI SINI 🔥 */}
                <RelatedProducts products={allAvailableProducts} />
                
            </div>
        </div>
    );
}