import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

interface ReviewWithData {
    id: string;
    title: string;
    comment: string;
    rating: number;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
    product: {
        images: { url: string }[];
    };
}

export default async function ReviewSection() {
    const reviews = await prisma.review.findMany({
        include: {
            user: true,
            product: {
                include: {
                    images: true,
                },
            },
        },
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
    }) as ReviewWithData[];

    return (
        <section className="max-w-11/12 mx-auto pb-54 pt-16 md:px-10">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    Reviews
                </h2>
                <Button className="bg-[#6366f1] hover:bg-[#5255d4] text-white rounded-xl font-bold uppercase px-6 h-12">
                    See All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                    <div
                        key={rev.id}
                        className="flex flex-col rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="bg-white p-8 space-y-4 grow">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black uppercase leading-tight">
                                        {rev.title || "Good Quality"}
                                    </h4>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                                        {rev.comment}
                                    </p>
                                </div>

                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#ECEEF0] shrink-0">
                                    <Image
                                        src={rev.user?.image || "/user-1.svg"}
                                        alt={rev.user?.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={i < rev.rating ? "#fbbf24" : "none"}
                                        className={i < rev.rating ? "text-[#fbbf24]" : "text-gray-300"}
                                    />
                                ))}
                                <span className="font-black text-lg ml-2">
                                    {rev.rating?.toFixed(1) || "5.0"}
                                </span>
                            </div>
                        </div>

                        <div className="relative aspect-square w-full bg-[#ECEEF0]">
                            <Image
                                src={rev.product?.images?.[0]?.url || "/placeholder-shoe.jpg"}
                                alt="Reviewed Product"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
