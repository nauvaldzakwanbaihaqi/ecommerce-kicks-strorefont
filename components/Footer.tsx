import { Facebook, Instagram, Twitter, Send } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full px-4 md:px-0 md:max-w-[95%] lg:max-w-[92%] mx-auto my-10 md:my-16 md:mt-32">
            {/* TOP SECTION - Blue Background */}
            <div className="relative bg-[#4A58E8] z-0 rounded-t-[40px] md:rounded-t-[64px] px-6 md:px-12 lg:px-20 pt-12 pb-28 md:pt-16 md:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0">
                    {/* Left Side - Newsletter */}
                    <div className="w-full lg:max-w-[60%] text-left">
                        <h2 className="text-white text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-tight mb-4 tracking-tight">
                            JOIN OUR KICKSPLUS CLUB & GET 15% OFF
                        </h2>
                        <p className="text-white/80 text-sm md:text-base lg:text-lg mb-8">
                            Sign up for free! Join the community.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full sm:flex-1 bg-transparent border border-white/40 rounded-lg px-5 py-3 md:py-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm md:text-base"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#232321] text-white px-8 py-3 md:py-4 rounded-lg font-bold uppercase text-xs md:text-sm tracking-wider hover:bg-black transition-all"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>

                    {/* Right Side - KICKS+ Logo (Muncul di Tablet/Laptop) */}
                    <div className="hidden lg:flex relative items-center justify-end">
                        <div className="relative">
                            <span className="text-white text-[120px] xl:text-[150px] font-black tracking-tighter leading-none select-none">
                                KICKS
                            </span>
                            <span className="absolute top-2 -right-6 text-[#FFA500] text-5xl xl:text-6xl font-bold">
                                +
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION - Dark Background */}
            <div className="relative bg-[#232321] rounded-[32px] md:rounded-[64px] px-6 py-12 md:px-12 lg:px-20 -mt-16 md:-mt-24 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Grid: 1 col (Mobile), 2 cols (Tablet), 4 cols (Laptop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
                        {/* Column 1 - About us */}
                        <div className="space-y-4">
                            <h4 className="text-[#FFA500] text-xl md:text-2xl font-bold uppercase">About us</h4>
                            <p className="text-sm md:text-base leading-relaxed text-[#E7E7E3] max-w-xs">
                                We are the biggest hyperstore in the universe. We got you all covered with our exclusive collections and latest drops.
                            </p>
                        </div>

                        {/* Column 2 - Categories */}
                        <div>
                            <h4 className="text-[#FFA500] text-xl md:text-2xl font-bold mb-6 uppercase">Categories</h4>
                            <ul className="text-[#E7E7E3] text-sm md:text-base space-y-3 font-semibold uppercase">
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Runners</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Sneakers</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Basketball</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Outdoor</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Golf</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Hiking</li>
                            </ul>
                        </div>

                        {/* Column 3 - Company */}
                        <div>
                            <h4 className="text-[#FFA500] text-xl md:text-2xl font-bold mb-6 uppercase">Company</h4>
                            <ul className="text-[#E7E7E3] text-sm md:text-base space-y-3 font-semibold uppercase">
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">About</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Contact</li>
                                <li className="hover:text-[#FFA500] cursor-pointer transition-colors">Blogs</li>
                            </ul>
                        </div>

                        {/* Column 4 - Follow us */}
                        <div>
                            <h4 className="text-[#FFA500] text-xl md:text-2xl font-bold mb-6 uppercase">Follow us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="hover:scale-110 transition-transform"><Facebook className="text-white" size={24} /></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Instagram className="text-white" size={24} /></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Twitter className="text-white" size={24} /></a>
                                <a href="#" className="hover:scale-110 transition-transform"><Send className="text-white" size={24} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Massive KICKS logo - Background Text */}
                    <div className="relative overflow-hidden w-full flex justify-center">
                        <span className="text-white text-[100px] sm:text-[180px] md:text-[250px] lg:text-[350px] xl:text-[450px] font-black tracking-tighter select-none leading-none block text-center whitespace-nowrap -mb-10 md:-mb-16 lg:-mb-24 opacity-100">
                            KICKS
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}