import { prismaMaster } from "../../config/prisma.js";
import { core } from "../../config/midtrans.js";

export async function handleNotification(notification) {
    try {
        const statusResponse = await core.transaction.notification(notification);
        const { transaction_status, order_id, transaction_id } = statusResponse;

        let paymentStatus = "PENDING";
        if (["settlement", "capture"].includes(transaction_status)) {
            paymentStatus = "PAID";
        } else if (["cancel", "expire", "deny"].includes(transaction_status)) {
            paymentStatus = "FAILED";
        }

        const transaction = await prismaMaster.transaction.findUnique({
            where: { orderId: order_id },
        });

        if (!transaction) {
            console.error(`[Midtrans] Transaction not found: ${order_id}`);
            return;
        }

        if (transaction.paymentStatus === paymentStatus) return;

        await prismaMaster.transaction.update({
            where: { orderId: order_id },
            data: {
                paymentMethod: statusResponse.payment_type,
                paymentStatus,
                paymentRef: transaction_id,
                updatedAt: new Date(),
            },
        });

        if (transaction.paymentStatus !== "PAID" && paymentStatus === "PAID") {
            await prismaMaster.product.update({
                where: { id: transaction.productId },
                data: {
                    stock: { decrement: transaction.quantity },
                },
            });
        }
    } catch (error) {
        console.error(`[Midtrans Notification Error]`, error);
        throw error;
    }
}
