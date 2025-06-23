import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import paymentRouter from "./payment.routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);

export default router;