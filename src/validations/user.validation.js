import Joi from "joi";

const roles = ["USER", "ADMIN"];

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6),
    googleId: Joi.string(),
    role: Joi.string().valid(...roles).optional(),
}).custom((value, helpers) => {
    if (!value.password && !value.googleId) {
        return helpers.message("Password or Google ID is required");
    }
    return value;
});


export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().min(3).max(50).optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid(...roles).optional(),
    deletedAt: Joi.date().optional(),
}).min(1);

export const userIdParamSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const UserEmailParamSchema = Joi.object({
    email: Joi.string().email().required(),
});
