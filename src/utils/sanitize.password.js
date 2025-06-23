export function sanitizeUserFromTransactions(transactions) {
    return transactions.map((tx) => {
        if (tx.user) {
            const { password, ...userWithoutPassword } = tx.user;
            return {
                ...tx,
                user: userWithoutPassword,
            };
        }
        return tx;
    });
}
