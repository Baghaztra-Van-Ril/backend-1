import Joi from "joi";

const validStatuses = ["PENDING", "PAID", "FAILED"];

export const updateTransactionSchema = Joi.object({
    ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    data: Joi.object({
        paymentStatus: Joi.string().uppercase().valid(...validStatuses),
        deletedAt: Joi.date().optional(),
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
