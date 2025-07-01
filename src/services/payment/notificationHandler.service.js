import { prismaMaster } from "../../config/prisma.js";
import { core } from "../../config/midtrans.js";
import { publishToQueue } from "../../queues/publisher.js";

export async function handleNotification(notification) {
    try {
        const statusResponse = await core.transaction.notification(notification);
        const {
            transaction_status,
            order_id,
            transaction_id,
            payment_type,
        } = statusResponse;

        if (!order_id || !transaction_status || !payment_type) {
            console.warn("[Midtrans] Notifikasi tidak valid, tidak dikirim ke queue.");
            return;
        }

        let paymentStatus = "PENDING";
        if (["settlement", "capture"].includes(transaction_status)) {
            paymentStatus = "PAID";
        } else if (["cancel", "expire", "deny"].includes(transaction_status)) {
            paymentStatus = "FAILED";
        }

        await publishToQueue("payment_status_update", {
            orderId: order_id,
            transactionId: transaction_id,
            paymentType: payment_type,
            paymentStatus,
            rawStatus: transaction_status,
        });

        console.log(`[Midtrans] Notifikasi diproses dan dikirim ke queue: ${order_id}`);
    } catch (error) {
        console.error(`[Midtrans Notification Error]`, error);
        throw error;
    }
}
