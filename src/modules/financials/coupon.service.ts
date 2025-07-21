// Coupon Service
// Handles coupon business logic
import { db, coupons as couponsTable } from "../../db/Drizzle.config";

export class CouponService {
  // Redeem a coupon
  async redeemCoupon(userId: string, code: string) {
    // Validate and redeem coupon in DB
    // Find coupon by code
    const [coupon] = await db
      .select()
      .from(couponsTable)
      .where(couponsTable.code.eq(code));
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    // Mark as redeemed
    const [updatedCoupon] = await db
      .update(couponsTable)
      .set({ status: "REDEEMED" })
      .where(couponsTable.id.eq(coupon.id))
      .returning();
    return {
      user_id: userId,
      code,
      status: updatedCoupon.status,
      discount: Number(updatedCoupon.discount),
    };
  }
}
