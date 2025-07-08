import { Router } from "express";
import passport from "passport";
import { loginSchema } from "../validations/auth.validation.js";
import { validate } from "../middlewares/validate.js";
import { rateLimiter } from "../middlewares/rateLimit.js";
import { authenticate } from "../middlewares/auth.js";
import {
    loginAdminController,
    logoutController,
    meController,
    googleCallbackController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", rateLimiter, validate(loginSchema), loginAdminController);
authRouter.post("/logout", authenticate, logoutController);

authRouter.get("/me", authenticate, meController);

authRouter.get("/google", rateLimiter, (req, res, next) => {
    const redirect = req.query.redirect || "/home";
    const authenticator = passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
        state: encodeURIComponent(redirect),
    });
    authenticator(req, res, next);
});

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallbackController
);

export default authRouter;
