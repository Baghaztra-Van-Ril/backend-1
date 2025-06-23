import { Router } from "express";
import express from "express";
import {
    createPaymentController,
    midtransWebhookController,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { createPaymentSchema } from "../validations/payment.validation.js";
import { validate } from "../middlewares/validate.js";

const paymentRouter = Router();

paymentRouter.post(
    "/create",
    authenticate,
    validate(createPaymentSchema),
    createPaymentController
);

paymentRouter.post(
    "/notification",
    express.json({ type: "application/json" }),
    midtransWebhookController
);

export default paymentRouter;