import dotenv from "dotenv";
dotenv.config();

import { consumeFromQueue } from "./consumerHelper.js";
import prisma from "../config/prisma.js";

console.log("🚀 Consumer script started...");

consumeFromQueue("payment_log", async (data) => {

    try {
        await prisma.transaction.create({
            data: {
                orderId: data.orderId,
                userId: data.userId,
                productId: data.productId,
                totalPrice: data.amount,
                quantity: data.quantity,
                paymentStatus: data.status,
                shipmentStatus: "PENDING",
            },
        });

        console.log("✅ Transaction saved:", data.orderId);
    } catch (error) {
        console.error("❌ Error saving transaction:", error.message);
    }
});
