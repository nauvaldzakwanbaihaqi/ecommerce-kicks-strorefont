import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

// Export auth options for use in other modules
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate input before querying the database
                const parsedCredentials = z.object({
                    email: z.string().email("Invalid email format."),
                    password: z.string().min(1, "Password is required.")
                }).safeParse(credentials);

                // Reject if validation fails
                if (!parsedCredentials.success) {
                    console.log("LOGIN_DEBUG: Zod Error ->", parsedCredentials.error.message);
                    return null;
                }

                // Extract validated data
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

// Initialize NextAuth handler with auth options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };