import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export default async function CartCount() {
    try {
        // Ambil session user pake cara NextAuth v4
        const session = await getServerSession(authOptions); 
        
        // Kalau gak ada user login, gak usah nampilin angka keranjang
        if (!session?.user?.id) return null;

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id }, // Pake ID asli dari session
            include: { items: true }
        });

        const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
        if (totalItems === 0) return null;

        return (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full font-bold">
                {totalItems}
            </span>
        );
    } catch {
        return null;
    }
}