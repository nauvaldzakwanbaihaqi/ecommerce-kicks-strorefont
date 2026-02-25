"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/lib/zod";

export type FormState = {
    errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        gender?: string[];
    };
    message?: string;
    success?: string;
    fields?: Record<string, string>;
};

export async function registerUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const rawData = Object.fromEntries(formData.entries()) as Record<string, string>;

    const fieldsToReturn = { ...rawData, password: "" };

    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Cek lagi datanya mang, ada yang salah tuh.",
            fields: fieldsToReturn
        };
    }

    const { firstName, lastName, email, password, gender } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return {
            message: "Email ini udah kedaftar mang!",
            fields: fieldsToReturn
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                gender: gender || "Other",
                role: "USER"
            },
        });

        return { success: "Akun berhasil dibuat! Silakan login mang." };
    } catch {
        return {
            message: "Waduh, ada masalah di server mang.",
            fields: fieldsToReturn
        };
    }
}