import LoginPageUI from "@/components/LoginPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Login",
};

export default async function LoginPage() {
    // 1. Cek apakah user udah login
    const session = await getServerSession();

    // 2. Kalau udah login, ngapain ke sini lagi? Redirect aja mang!
    if (session) {
        redirect("/");
    }

    return <LoginPageUI />;
}