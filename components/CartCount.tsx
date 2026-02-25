import prisma, { USER_ID } from "@/lib/prisma";

export default async function CartCount() {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: USER_ID },
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
