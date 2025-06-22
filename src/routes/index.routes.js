import { Router } from "express";
import userRouter from "./user.routes.js";
const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.use("/users", userRouter);

export default router;