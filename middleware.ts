import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        // PERHATIKAN: Pake nextUrl (U-nya gede) mang!
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

        // Kalau akses halaman Admin tapi role-nya bukan ADMIN, tendang!
        if (isAdminPage && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Biar middleware jalan cuma kalau user sudah login
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    // Pintu-pintu yang dijagain Satpam Middleware
    matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*"],
};