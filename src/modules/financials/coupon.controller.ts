// Coupon Controller
// Handles coupon endpoints
import { CouponService } from "./coupon.service";
import { logger } from "../../utils/Logger";
import { publishToQueue } from "../../utils/rabbitmqClient";

const couponService = new CouponService();

export class CouponController {
  // Redeem a coupon
  async redeemCoupon(req, res) {
    logger.info(
      { user: req.user?.id, body: req.body },
      "Redeem coupon request received"
    );
    try {
      const userId = req.user?.id;
      const { code } = req.body;
      const result = await couponService.redeemCoupon(userId, code);
      logger.info({ result }, "Coupon redeemed successfully");
      await publishToQueue("coupon_events", {
        type: "coupon_redeemed",
        userId,
        code,
      });
      logger.info(
        { queue: "coupon_events", userId, code },
        "Coupon event pushed to RabbitMQ"
      );
      res.send(result);
    } catch (err) {
      logger.error({ err }, "Failed to redeem coupon");
      res.status(500).send({ error: "Failed to redeem coupon" });
    }
  }
}
