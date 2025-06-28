import Joi from "joi";

export const createPaymentSchema = Joi.object({
    productId: Joi.number().integer().positive().required().messages({
        "any.required": "productId is required",
        "number.base": "productId must be a number",
        "number.positive": "productId must be a positive number",
    }),
    quantity: Joi.number().integer().positive().required().messages({
        "any.required": "quantity is required",
        "number.base": "quantity must be a number",
        "number.positive": "quantity must be a positive number",
    }),
    promoId: Joi.number().integer().positive().optional().messages({
        "number.base": "promoId must be a number",
        "number.positive": "promoId must be a positive number",
    }),
});
