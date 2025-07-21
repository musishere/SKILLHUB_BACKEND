// Transaction Controller
// Handles transaction endpoints
import { TransactionService } from "./transaction.service";
import { logger } from "../../utils/Logger";
import { publishToQueue } from "../../utils/rabbitmqClient";

const transactionService = new TransactionService();

export class TransactionController {
  // Create a transaction (purchase)
  async createTransaction(req, res) {
    logger.info(
      { user: req.user?.id, body: req.body },
      "Create transaction request received"
    );
    try {
      const userId = req.user?.id;
      const data = req.body;
      const transaction = await transactionService.createTransaction(
        userId,
        data
      );
      logger.info({ transaction }, "Transaction created successfully");
      await publishToQueue("transaction_events", {
        type: "transaction_created",
        userId,
        data,
      });
      logger.info(
        { queue: "transaction_events", userId, data },
        "Transaction event pushed to RabbitMQ"
      );
      res.send(transaction);
    } catch (err) {
      logger.error({ err }, "Failed to create transaction");
      res.status(500).send({ error: "Failed to create transaction" });
    }
  }

  // Get user transactions
  async getTransactions(req, res) {
    logger.info({ user: req.user?.id }, "Get transactions request received");
    try {
      const userId = req.user?.id;
      const transactions = await transactionService.getTransactions(userId);
      logger.info({ transactions }, "Transactions fetched successfully");
      res.send(transactions);
    } catch (err) {
      logger.error({ err }, "Failed to get transactions");
      res.status(500).send({ error: "Failed to get transactions" });
    }
  }
}
