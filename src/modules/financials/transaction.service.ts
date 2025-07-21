// Transaction Service
// Handles transaction business logic
import { setCache, getCache } from "../../utils/redisClient";
import { db, transactions as transactionsTable } from "../../db/Drizzle.config";

export class TransactionService {
  // Create a transaction (purchase)
  async createTransaction(userId: string, data: any) {
    // Insert transaction in DB
    const { amount, status } = data;
    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        user_id: userId,
        amount: String(amount),
        status: status || "PENDING",
      })
      .returning();
    // Invalidate cache
    const cacheKey = `transactions:${userId}`;
    await setCache(cacheKey, null, 0);
    // Cast amount to number for API response
    transaction.amount = Number(transaction.amount);
    return transaction;
  }

  // Get user transactions, using Redis cache
  async getTransactions(userId: string) {
    const cacheKey = `transactions:${userId}`;
    let transactions = await getCache(cacheKey);
    if (!transactions) {
      // Fetch from DB
      transactions = await db
        .select()
        .from(transactionsTable)
        .where(transactionsTable.user_id.eq(userId));
      // Cast amount to number for API response
      transactions = transactions.map((txn) => ({
        ...txn,
        amount: Number(txn.amount),
      }));
      await setCache(cacheKey, transactions, 3600);
    }
    return transactions;
  }
}
