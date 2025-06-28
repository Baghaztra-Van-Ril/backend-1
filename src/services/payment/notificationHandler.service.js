import midtransClient from "midtrans-client";
import { prismaMaster, prismaSlave } from "../../config/prisma.js";
import { AppError } from "../../errors/handle_error.js";

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function handleNotification(notification) {
    const statusResponse = await core.transaction.notification(notification);
    const { transaction_status, order_id } = statusResponse;

    let paymentStatus = "PENDING";
    if (["settlement", "capture"].includes(transaction_status)) {
        paymentStatus = "PAID";
    } else if (["cancel", "expire", "deny"].includes(transaction_status)) {
        paymentStatus = "FAILED";
    }

    const transaction = await prismaSlave.transaction.findUnique({
        where: { orderId: order_id },
    });

    if (!transaction) throw new AppError("Transaction not found", 404);
    if (transaction.paymentStatus === paymentStatus) return;

    await prismaMaster.transaction.update({
        where: { orderId: order_id },
        data: {
            paymentStatus,
            updatedAt: new Date(),
        },
    });

    if (paymentStatus === "PAID") {
        await prismaMaster.product.update({
            where: { id: transaction.productId },
            data: {
                stock: { decrement: transaction.quantity },
            },
        });
    }
}
