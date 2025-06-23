import snap from "../../config/midtrans.js";
import { publishToQueue } from "../../queues/publisher.js";
import { buildMidtransParams } from "../../helpers/midtransParamsBuilder.js";

export async function createSnapTransaction({ orderId, product, quantity, totalPrice, user }) {
    const params = buildMidtransParams({ orderId, product, quantity, totalPrice, user });
    const transaction = await snap.createTransaction(params);

    await publishToQueue("payment_log", {
        orderId,
        userId: user.id,
        productId: product.id,
        amount: totalPrice,
        quantity,
        status: "PENDING",
        snapToken: transaction.token,
    });

    return transaction;
}
