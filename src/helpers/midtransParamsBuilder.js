export function buildMidtransParams({ orderId, product, quantity, price, finalAmount, user }) {
    return {
        transaction_details: {
            order_id: orderId,
            gross_amount: finalAmount,
        },
        item_details: [
            {
                id: String(product.id),
                name: product.name,
                price: price,
                quantity: +quantity,
            },
        ],
        credit_card: {
            secure: true,
        },
        customer_details: {
            email: user.email,
            first_name: user.name || "Customer",
        },
    };
}
