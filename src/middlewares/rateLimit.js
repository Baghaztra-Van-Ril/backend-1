import redis from "../config/redis.js";
import { AppError } from "../errors/handle_error.js";

export async function rateLimiter(req, res, next) {
    try {
        const ip = req.ip;
        const key = `rl_${ip}`;
        const limit = 1000;
        const windowInSeconds = 900; // 15 minutes

        const count = await redis.incr(key);
        if (count === 1) {
            await redis.expire(key, windowInSeconds);
        }

        if (count > limit) {
            throw new AppError("Too many requests. Please try again later.", 429);
        }

        next();
    } catch (err) {
        next(err);
    }
}