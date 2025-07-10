import { snap } from "../../config/midtrans.js";
import { publishToQueue } from "../../queues/publisher.js";
import { buildMidtransParams } from "../../helpers/midtransParamsBuilder.js";
import { AppError } from "../../errors/handle_error.js";

export async function createSnapTransaction({
    orderId,
    product,
    promoId,
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
            promoId,
            quantity,
            price,
            promoAmount,
            finalAmount,
            user,
        });

        const transaction = await snap.createTransaction(params);

        await publishToQueue("payment_log", {
            orderId,
            userId: user.id,
            productId: product.id,
            promoId,
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
