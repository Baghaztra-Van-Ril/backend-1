import Joi from "joi";

const shipmentStatuses = ["PENDING", "SHIPPED", "DELIVERED", "FAILED"];
const validStatuses = ["PENDING", "PAID", "FAILED"];

export const updateTransactionSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    data: Joi.object({
        shipmentStatus: Joi.string().uppercase().valid(...shipmentStatuses),
    }).min(1).required(),
});

export const deleteTransactionSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer().positive()).optional(),
});

export const transactionIdParamSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const getTransactionFilterSchema = Joi.object({
    status: Joi.string().uppercase().valid(...validStatuses).optional(),
    userId: Joi.number().integer().positive().optional(),
});
