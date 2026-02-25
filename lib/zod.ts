import { z } from "zod";

export const RegisterSchema = z.object({
    firstName: z.string().min(2, "Nama depan minimal 2 huruf mang"),
    lastName: z.string().min(2, "Nama belakang minimal 2 huruf mang"),
    email: z.string().email("Format email salah mang"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    gender: z.string().optional(), // Disesuain sama skema prisma lu
});