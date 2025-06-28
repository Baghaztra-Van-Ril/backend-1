import { prismaMaster, prismaSlave } from "../config/prisma.js";
import { AppError } from "../errors/handle_error.js";
import bcrypt from "bcryptjs";

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

export async function getAllUserService() {
    try {
        return await prismaSlave.user.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch users", 500, error);
    }
}

export async function getUserByIdService(id) {
    try {
        const user = await prismaSlave.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch user by ID", 500, error);
    }
}

export async function getUserByEmailService(email) {
    try {
        const user = await prismaSlave.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch user by email", 500, error);
    }
}

export async function createUserService(userData) {
    try {
        const existingUser = await prismaSlave.user.findUnique({ where: { email: userData.email } });
        if (existingUser) {
            throw new AppError("User already exists", 409);
        }

        const { name, email, role, googleId, password } = userData;

        const hashedPassword = password
            ? await bcrypt.hash(password, saltRounds)
            : null;

        const user = await prismaMaster.user.create({
            data: {
                name,
                email,
                role: role || "ADMIN",
                googleId,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to create user", 500, error);
    }
}

export async function updateUserService(id, userData) {
    try {
        const dataToUpdate = { ...userData };

        if (dataToUpdate.password) {
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltRounds);
        }

        dataToUpdate.updatedAt = new Date();

        const user = await prismaMaster.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        return user;
    } catch (error) {
        if (error.code === "P2025") {
            throw new AppError("User not found", 404);
        }
        if (error.code === "P2002") {
            throw new AppError("Email already exists", 409);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to update user", 500, error);
    }
}

export async function deleteUserService(id) {
    try {
        const user = await prismaMaster.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                deletedAt: true,
            },
        });

        return user;
    } catch (error) {
        if (error.code === "P2025") {
            throw new AppError("User not found", 404);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to delete user", 500, error);
    }
}
