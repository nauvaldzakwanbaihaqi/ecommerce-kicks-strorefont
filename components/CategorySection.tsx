import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategorySection() {
    const categories = [
        {
            title: "Lifestyle Shoes",
            image: "/category/category-2.svg", // Pastiin file ada di folder public/images
            color: "bg-[#ECEEF0]",
        },
        {
            title: "Basketball Shoes",
            image: "/category/category-1.svg",
            color: "bg-[#F6F6F6]",
        },
    ];

    return (
        <section className="w-full bg-[#1a1a1a] pt-6 mb-0 px-4 md:px-10">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black uppercase tracking-tight">
                    Categories
                </h2>

                {/* Navigation Buttons */}
                <div className="flex gap-1.5 md:gap-2">
                    <Button variant="outline" size="icon" className="bg-[#717171] border-none hover:bg-white/20 rounded-lg h-9 w-9 md:h-10 md:w-10">
                        <ChevronLeft className="text-white w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white border-none hover:bg-white/90 rounded-lg h-9 w-9 md:h-10 md:w-10">
                        <ChevronRight className="text-black w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                </div>
            </div>

            {/* Categories Grid - Stacked on mobile, side-by-side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 overflow-hidden">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className={`relative group h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] ${cat.color} p-6 md:p-8 flex flex-col justify-end
              ${index === 0 ? 'rounded-tl-[32px] md:rounded-tl-[64px]' : ''}
              ${index === categories.length - 1 ? 'rounded-b-[32px] md:rounded-b-none' : ''}
              ${categories.length === 1 ? 'md:rounded-br-[64px]' : ''}`}
                    >
                        {/* Image Sneaker */}
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                width={500}
                                height={500}
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Title & Icon */}
                        <div className="relative z-10 flex justify-between items-end">
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight max-w-[180px] md:max-w-[200px] tracking-tight">
                                {cat.title}
                            </h3>
                            <div className="bg-[#1a1a1a] p-2.5 md:p-3 rounded-lg md:rounded-xl cursor-pointer hover:bg-black transition-colors">
                                <ArrowUpRight className="text-white w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}