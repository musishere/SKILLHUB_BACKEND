// Enrollment Controller
// Handles enrollment management endpoints
import { EnrollmentService } from "./enrollment.service";
import { logger } from "../../utils/Logger";
import { publishToQueue } from "../../utils/rabbitmqClient";
import { FastifyRequest, FastifyReply } from "fastify";

const enrollmentService = new EnrollmentService();

export class EnrollmentController {
  // Enroll user endpoint
  async enroll(req: FastifyRequest, res: FastifyReply) {
    debugger; // Debugger for manual inspection
    logger.info(
      { user: (req as any).user?.id, body: req.body },
      "Enroll request received"
    );
    try {
      const userId = (req as any).user?.id || (req.body as any).user_id;
      const productId = (req.body as any).product_id;
      const enrollment = await enrollmentService.enroll(userId, productId);
      logger.info({ enrollment }, "User enrolled successfully");
      await publishToQueue("enrollment_events", {
        type: "enrolled",
        userId,
        productId,
      });
      logger.info(
        { queue: "enrollment_events", userId, productId },
        "Enrollment event pushed to RabbitMQ"
      );
      res.send(enrollment);
    } catch (err) {
      logger.error({ err }, "Failed to enroll user");
      const message = err instanceof Error ? err.message : String(err);
      console.error("Enroll error:", err); // Log the error for debugging
      res.status(500).send({ error: "Failed to enroll", details: message });
    }
  }

  // Get enrollment status endpoint
  async getEnrollment(req: FastifyRequest, res: FastifyReply) {
    logger.info(
      { user: (req as any).user?.id, query: req.query },
      "Get enrollment request received"
    );
    try {
      const userId = (req as any).user?.id || (req.query as any).user_id;
      const productId = (req.query as any).product_id;
      const enrollment = await enrollmentService.getEnrollment(
        userId,
        productId
      );
      logger.info({ enrollment }, "Enrollment fetched successfully");
      res.send(enrollment);
    } catch (err) {
      logger.error({ err }, "Failed to get enrollment");
      const message = err instanceof Error ? err.message : String(err);
      res
        .status(500)
        .send({ error: "Failed to get enrollment", details: message });
    }
  }
}
