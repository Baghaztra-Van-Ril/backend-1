import redis from "../config/redis.js";
import { loginAdminService } from "../services/auth.service.js";
import { cookieOptions } from "../utils/cookies.js";
import { generateToken } from "../utils/jwt.js";
import { extractToken } from "../utils/auth.js";

export const meController = (req, res) => {
    res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0'
    })

    res.json(req.user);
};

export const googleCallbackController = (req, res) => {
    const user = req.user;

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    res.cookie("token", token, cookieOptions);

    const redirectPath = decodeURIComponent(req.query.state || "/home");

    const safePath = redirectPath.startsWith("/") ? redirectPath : "/home";
    res.redirect(`${process.env.FRONTEND_URL}${safePath}`);
};



export async function loginAdminController(req, res, next) {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginAdminService(email, password);

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (err) {
        next(err);
    }
}

export async function logoutController(req, res, next) {
    try {
        const token = extractToken(req);
        const { exp } = req.user;

        const ttl = Math.max(exp - Math.floor(Date.now() / 1000), 0);
        await redis.set(`bl_${token}`, "", { EX: ttl });

        res.clearCookie("token", cookieOptions);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
}
