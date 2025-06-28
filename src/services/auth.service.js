import bcrypt from "bcryptjs";
import { AppError } from "../errors/handle_error.js";
import { prismaSlave } from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

export async function loginAdminService(email, password) {
    const user = await prismaSlave.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
        throw new AppError("Unauthorized", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}