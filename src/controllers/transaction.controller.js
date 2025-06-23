import {
    getAllTransactionService,
    updateTransactionService,
    allTransactionsService,
    getTransactionService,
    getTransactionByIdService,
    deleteTransactionsService,
} from "../services/transaction.service.js";

export async function getAllTransactionController(req, res, next) {
    try {
        const { status, userId } = req.filteredQuery;

        const data = await getAllTransactionService({ status, userId: Number(userId) });
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

export async function getUserTransactionsController(req, res, next) {
    try {
        const userId = req.user.id;
        const data = await getTransactionService(userId);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

export async function getTransactionByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const data = await getTransactionByIdService(Number(id));

        if (role !== "ADMIN" && data.userId !== userId) {
            return next(new AppError("Access denied", 403));
        }

        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}


export async function updateTransactionController(req, res, next) {
    try {
        const { ids, data } = req.body;
        const result = await updateTransactionService(ids, data);
        res.json({ success: true, message: "Transactions updated", data: result });
    } catch (err) {
        next(err);
    }
}

export async function deleteTransactionController(req, res, next) {
    try {
        const userId = req.user.id;
        const { ids } = req.body;
        const result = await deleteTransactionsService({ userId, ids });
        res.json({ success: true, message: "Transactions deleted", data: result });
    } catch (err) {
        next(err);
    }
}

export async function allTransactionsController(req, res, next) {
    try {
        const data = await allTransactionsService();
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}
