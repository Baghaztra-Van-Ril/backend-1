import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import {
    loginAdminController,
    logoutController
} from "../controllers/auth.controller.js";
import { loginSchema } from "../validations/auth.validation.js";
import { validate } from "../middlewares/validate.js";
import { rateLimiter } from "../middlewares/rateLimit.js";
import { authenticate } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/login", rateLimiter, validate(loginSchema), loginAdminController);
authRouter.post("/logout", authenticate, logoutController);

authRouter.get(
    "/google",
    rateLimiter,
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        const user = req.user;

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
    }
);

export default authRouter;
