export function calculateFinalPrice(price, quantity, discount = 0) {
    const total = price * quantity;
    const promoAmount = Math.floor(total * discount);
    return {
        totalPrice: total,
        promoAmount,
        finalAmount: total - promoAmount,
    };
}
