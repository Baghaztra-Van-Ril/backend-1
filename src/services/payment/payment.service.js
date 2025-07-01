import { prismaSlave } from "../../config/prisma.js";
import { createSnapTransaction } from "./createSnap.service.js";
import { generateRandomCode } from "../../utils/generateRandomCode.js";
import { AppError } from "../../errors/handle_error.js";
import { calculateFinalPrice } from "../../helpers/calculateFinalPrice.js";

export async function generatePaymentDataAndCreateSnap(body, user) {
    const { productId, quantity, promoId } = body;
    const orderId = await generateRandomCode();

    const product = await prismaSlave.product.findUnique({
        where: { id: Number(productId) },
    });
    if (!product) throw new AppError("Product not found", 404);

    let promo = null;
    if (promoId) {
        promo = await prismaSlave.promo.findFirst({
            where: {
                id: Number(promoId),
                isActive: true,
            },
        });
        if (!promo) {
            throw new AppError("Promo not found or inactive", 404);
        }
    }

    const price = product.price;
    const { totalPrice, promoAmount, finalAmount } = calculateFinalPrice(
        price,
        quantity,
        promo?.discount ?? 0
    );

    const transaction = await createSnapTransaction({
        orderId,
        product,
        promoId: promo?.id ?? null,
        price,
        promoId,
        quantity,
        finalAmount,
        promoAmount,
        user,
    });

    return {
        snapToken: transaction.token,
        redirect_url: transaction.redirect_url,
        orderId,
        price,
        quantity,
        promoAmount,
        totalPrice,
        finalAmount,
        product,
    };
}
