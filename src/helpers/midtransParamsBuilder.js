export function buildMidtransParams({
    orderId,
    product,
    quantity,
    price,
    finalAmount,
    promoAmount = 0,
    user,
}) {
    const itemDetails = [
        {
            id: String(product.id),
            name: product.name,
            price: price,
            quantity: +quantity,
        },
    ];

    if (promoAmount > 0) {
        itemDetails.push({
            id: "promo",
            name: "Promo Discount",
            price: -promoAmount,
            quantity: 1,
        });
    }

    return {
        transaction_details: {
            order_id: orderId,
            gross_amount: finalAmount,
        },
        item_details: itemDetails,
        credit_card: {
            secure: true,
        },
        customer_details: {
            email: user.email,
            first_name: user.name || "Customer",
        },
        callbacks: {
            finish: `${process.env.FRONTEND_URL}/history`,
        }
    };
}
