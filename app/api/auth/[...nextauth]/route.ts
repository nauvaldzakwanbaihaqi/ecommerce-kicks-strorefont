import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod"; // 1. Import Zod-nya mang!

// 2. KELUARIN SETTINGANNYA KE VARIABEL YANG DI-EXPORT!
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 3. ZOD BERAKSI DI SINI: Validasi input sebelum nyentuh database!
                const parsedCredentials = z.object({
                    email: z.string().email("Format email salah mang!"),
                    password: z.string().min(1, "Password nggak boleh kosong!") // Sesuaikan minimal karakternya kalau mau
                }).safeParse(credentials);

                // Kalau Zod bilang formatnya salah, langsung tendang (return null)
                if (!parsedCredentials.success) {
                    console.log("LOGIN_DEBUG: Zod Error ->", parsedCredentials.error.message);
                    return null;
                }

                // Kalau lolos Zod, ambil data yang udah "bersih"
                const { email, password } = parsedCredentials.data;

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: email }
                    });

                    console.log("LOGIN_DEBUG: User found ->", !!user);

                    if (!user || !user.password) return null;

                    const isMatch = await bcrypt.compare(password, user.password);
                    console.log("LOGIN_DEBUG: Password match ->", isMatch);

                    if (!isMatch) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch {
                    console.error("AUTH_ERROR_DATABASE: Failed to authenticate");
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url && url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

// 4. MASUKIN authOptions KE DALAM HANDLER
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };