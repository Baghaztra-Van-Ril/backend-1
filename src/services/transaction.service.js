import prisma from "../config/prisma.js";
import { AppError } from "../errors/handle_error.js";
import { sanitizeUserFromTransactions } from "../utils/sanitize.password.js";

export async function getAllTransactionService({ status, userId } = {}) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                ...(status && { paymentStatus: status }),
                ...(userId && { userId }),
                deletedAt: null,
            },
            include: {
                user: true,
                product: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return sanitizeUserFromTransactions(transactions);
    } catch (error) {
        throw new AppError("Failed to fetch transactions", 500, error);
    }
}

export async function updateTransactionService(ids, data) {
    try {
        const result = await prisma.transaction.updateMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            data,
        });

        if (result.count === 0) {
            throw new AppError("No transactions updated", 404);
        }

        return result;
    } catch (error) {
        throw new AppError("Failed to update transactions", 500, error);
    }
}

export async function allTransactionsService() {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { deletedAt: null },
            include: {
                user: true,
                product: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return sanitizeUserFromTransactions(transactions);
    } catch (error) {
        throw new AppError("Failed to export transactions", 500, error);
    }
}

export async function getTransactionService(userId) {
    try {
        return await prisma.transaction.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            include: {
                product: true,
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        throw new AppError("Failed to fetch transactions", 500, error);
    }
}

export async function getTransactionByIdService(transactionId) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                user: true,
                product: true,
            },
        });

        if (!transaction) throw new AppError("Transaction not found", 404);

        if (transaction.user) {
            const { password, ...userWithoutPassword } = transaction.user;
            transaction.user = userWithoutPassword;
        }

        return transaction;
    } catch (error) {
        throw new AppError("Failed to fetch transaction", 500, error);
    }
}

export async function deleteTransactionsService({ userId, ids = [] }) {
    try {
        const whereClause = {
            userId,
            ...(ids.length > 0 && { id: { in: ids } }),
        };

        const result = await prisma.transaction.updateMany({
            where: whereClause,
            data: { deletedAt: new Date() },
        });

        if (result.count === 0) {
            throw new AppError("No transactions deleted", 404);
        }

        return result;
    } catch (error) {
        throw new AppError("Failed to delete transactions", 500, error);
    }
}
