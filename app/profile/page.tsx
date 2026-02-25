import { getServerSession } from "next-auth/next";
// Import konfigurasi auth lu (sesuaikan path-nya sama kodingan lu ya mang!)
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    // 1. Tanya satpam: "Mang, ini orang udah login belum?"
    const session = await getServerSession(authOptions);

    // 2. Kalau belum login, tendang balik ke halaman login!
    if (!session) {
        redirect("/login");
    }

    // 3. Kalau udah login, tampilin datanya
    return (
        <div className="max-w-[91%] mx-auto py-20 text-center">
            <h1 className="text-4xl font-black uppercase">Halo, {session.user?.name}!</h1>
            <p className="text-gray-500">Email lu: {session.user?.email}</p>
        </div>
    );
}