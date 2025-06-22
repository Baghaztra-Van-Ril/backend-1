import { Router } from "express";
import {
    createUserController,
    getUserByIdController,
    getUserByEmailController,
    updateUserController,
    deleteUserController,
    getAllUsersController,
} from "../controllers/user.controller.js";

import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    UserEmailParamSchema,
} from "../validations/user.validation.js";

import { validate } from "../middlewares/validate.js";

const userRouter = Router();

userRouter.get("/", getAllUsersController);
userRouter.get("/:id", validate(userIdParamSchema, "params"), getUserByIdController);
userRouter.get("/email/:email", validate(UserEmailParamSchema, "params"), getUserByEmailController);
userRouter.post("", validate(createUserSchema), createUserController);
userRouter.put("/:id", validate(userIdParamSchema, "params"), validate(updateUserSchema), updateUserController);
userRouter.delete("/:id", validate(userIdParamSchema, "params"), deleteUserController);

export default userRouter;