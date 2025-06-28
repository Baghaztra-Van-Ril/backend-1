import { snap } from "../../config/midtrans.js";
import { publishToQueue } from "../../queues/publisher.js";
import { buildMidtransParams } from "../../helpers/midtransParamsBuilder.js";

export async function createSnapTransaction({
    orderId,
    product,
    price,
    quantity,
    promoAmount,
    finalAmount,
    user,
}) {
    try {
        const params = buildMidtransParams({
            orderId,
            product,
            quantity,
            price,
            finalAmount,
            user,
        });

        const transaction = await snap.createTransaction(params);

        await publishToQueue("payment_log", {
            orderId,
            userId: user.id,
            productId: product.id,
            promoId: product.promoId || null,
            price,
            quantity,
            promoAmount,
            finalAmount,
            status: "PENDING",
            snapToken: transaction.token,
        });

        return transaction;
    } catch (err) {
        console.error("[❌ createSnapTransaction error]:", err);
        throw new AppError("Failed to create Midtrans transaction", 500);
    }
}
