// Payout Service
// Handles instructor payout business logic
import { db, payouts as payoutsTable } from "../../db/Drizzle.config";

export class PayoutService {
  // Create an instructor payout
  async createPayout(adminId: string, data: any) {
    // Insert payout in DB
    const { instructor_id, amount, status } = data;
    const [payout] = await db
      .insert(payoutsTable)
      .values({
        instructor_id,
        amount: String(amount),
        status: status || "PENDING",
      })
      .returning();
    // Cast amount to number for API response
    payout.amount = Number(payout.amount);
    return payout;
  }

  // Get instructor payouts
  async getPayouts() {
    // Fetch from DB
    let payouts = await db.select().from(payoutsTable);
    // Cast amount to number for API response
    payouts = payouts.map((p) => ({ ...p, amount: Number(p.amount) }));
    return payouts;
  }
}
