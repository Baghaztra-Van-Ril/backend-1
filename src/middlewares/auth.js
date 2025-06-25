import redis from "../config/redis.js";
import { AppError } from "../errors/handle_error.js";
import { verifyToken } from "../utils/jwt.js";
import { extractToken } from "../utils/auth.js";

export async function authenticate(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return next(new AppError("Unauthorized: No token provided", 401));
    }
    try {
        const isBlacklisted = await redis.get(`bl_${token}`);
        if (isBlacklisted) {
            return next(new AppError("Unauthorized: Token is blacklisted", 401));
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        next(new AppError("Unauthorized: Invalid token", 401));
    }
}

export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError("Forbidden: Access denied", 403));
        }
        next();
    };
}
