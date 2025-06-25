import { createSnapTransaction } from "../services/payment/createSnap.service.js";
import { handleNotification } from "../services/payment/notificationHandler.service.js";
import prisma from "../config/prisma.js";
import { generateRandomCode } from "../utils/generateRandomCode.js";

export async function createPaymentController(req, res, next) {
    try {
        const orderId = await generateRandomCode();
        const { productId, quantity } = req.body;
        const user = req.user;

        const product = await prisma.product.findUnique({
            where: { id: Number(productId) },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const totalPrice = product.price * quantity;

        const transaction = await createSnapTransaction({
            orderId,
            product,
            quantity,
            totalPrice,
            user,
        });

        res.status(200).json({
            success: true,
            data: {
                snapToken: transaction.token,
                redirect_url: transaction.redirect_url,
                orderId,
                quantity,
                totalPrice,
                product,
            }
        });
    } catch (err) {
        next(err);
    }
}

export async function midtransWebhookController(req, res, next) {
    try {
        await handleNotification(req.body);
        res.status(200).json({ success: true, message: "Notification received" });
    } catch (err) {
        next(err);
    }
}
