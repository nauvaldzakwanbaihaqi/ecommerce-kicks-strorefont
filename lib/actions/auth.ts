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
            message: "Please review your information. Some fields contain errors.",
            fields: fieldsToReturn
        };
    }

    const { firstName, lastName, email, password, gender } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return {
            message: "This email address is already registered.",
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

        return { success: "Your account has been created successfully. Please sign in." };
    } catch {
        return {
            message: "An unexpected server error occurred. Please try again later.",
            fields: fieldsToReturn
        };
    }
}