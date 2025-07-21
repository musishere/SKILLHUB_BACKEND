// Application Error Controller
// Handles application error log endpoints
import { ApplicationErrorService } from "./applicationError.service";
import { logger } from "../../utils/Logger";

const applicationErrorService = new ApplicationErrorService();

export class ApplicationErrorController {
  // List application errors
  async listApplicationErrors(req, res) {
    logger.info(
      { admin: req.user?.id },
      "List application errors request received"
    );
    try {
      const errors = await applicationErrorService.listApplicationErrors();
      logger.info({ errors }, "Application errors fetched successfully");
      res.send(errors);
    } catch (err) {
      logger.error({ err }, "Failed to list application errors");
      res.status(500).send({ error: "Failed to list application errors" });
    }
  }
}
