// Financial Controller
// Handles financial management endpoints
import { FinancialService } from "./financial.service";

const financialService = new FinancialService();

export class FinancialController {
  // Get user transactions endpoint
  async getTransactions(req, res) {
    try {
      const userId = req.user?.id || req.query.user_id;
      const transactions = await financialService.getTransactions(userId);
      res.send(transactions);
    } catch (err) {
      res.status(500).send({ error: "Failed to get transactions" });
    }
  }

  // Record transaction endpoint
  async recordTransaction(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id;
      const data = req.body;
      const transaction = await financialService.recordTransaction(
        userId,
        data
      );
      res.send(transaction);
    } catch (err) {
      res.status(500).send({ error: "Failed to record transaction" });
    }
  }
}
