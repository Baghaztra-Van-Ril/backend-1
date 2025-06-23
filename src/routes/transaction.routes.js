import { Router } from "express";
import {
    getAllTransactionController,
    getUserTransactionsController,
    getTransactionByIdController,
    updateTransactionController,
    deleteTransactionController,
    allTransactionsController,
} from "../controllers/transaction.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
    updateTransactionSchema,
    deleteTransactionSchema,
    transactionIdParamSchema,
    getTransactionFilterSchema,
} from "../validations/transaction.validation.js";

const transactionRouter = Router();

transactionRouter.get("/", authenticate, authorize("ADMIN"), validate(getTransactionFilterSchema, "query"), getAllTransactionController);
transactionRouter.patch("/", authenticate, authorize("ADMIN"), validate(updateTransactionSchema), updateTransactionController);
transactionRouter.get("/all", authenticate, authorize("ADMIN"), allTransactionsController);
transactionRouter.get("/user", authenticate, getUserTransactionsController);
transactionRouter.get("/:id", authenticate, validate(transactionIdParamSchema, "params"), getTransactionByIdController);
transactionRouter.delete("/", authenticate, validate(deleteTransactionSchema), deleteTransactionController);

export default transactionRouter;
