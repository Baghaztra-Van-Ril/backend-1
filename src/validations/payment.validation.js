import Joi from "joi";

export const createPaymentSchema = Joi.object({
    productId: Joi.number().integer().positive().min(1).required().messages({
        "any.required": "productId is required",
        "number.base": "productId must be a number",
        "number.positive": "productId must be a positive number",
        "number.min": "productId must be at least 1",
    }),
    quantity: Joi.number().integer().positive().min(1).required().messages({
        "any.required": "quantity is required",
        "number.base": "quantity must be a number",
        "number.positive": "quantity must be a positive number",
        "number.min": "quantity must be at least 1",
    }),
    promoId: Joi.number().integer().positive().min(1).optional().messages({
        "number.base": "promoId must be a number",
        "number.positive": "promoId must be a positive number",
        "number.min": "promoId must be at least 1",
    }),
});
