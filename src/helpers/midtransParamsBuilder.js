export function buildMidtransParams({ orderId, product, quantity, totalPrice, user }) {
    return {
        transaction_details: {
            order_id: orderId,
            gross_amount: totalPrice,
        },
        item_details: [
            {
                id: String(product.id),
                name: product.name,
                price: product.price,
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
