import redis from "../config/redis.js";
import jwt from "jsonwebtoken";
import { loginAdminService } from "../services/auth.service.js";

export async function loginAdminController(req, res, next) {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginAdminService(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (err) {
        next(err);
    }
}

export async function logoutController(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided", 400);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.decode(token);
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;

        await redis.set(`bl_${token}`, "1", { ex: ttl });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
}