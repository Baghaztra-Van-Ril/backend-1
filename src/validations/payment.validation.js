import Joi from "joi";

export const createPaymentSchema = Joi.object({
    orderId: Joi.string().required().messages({
        "any.required": "orderId is required",
        "string.base": "orderId must be a string",
    }),
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
});
