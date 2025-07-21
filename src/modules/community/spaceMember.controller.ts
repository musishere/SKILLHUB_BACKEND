// Space Member Controller
// Handles space member endpoints
import { SpaceMemberService } from "./spaceMember.service";
import { logger } from "../../utils/Logger";
import { publishToQueue } from "../../utils/rabbitmqClient";

const spaceMemberService = new SpaceMemberService();

export class SpaceMemberController {
  // Join a space
  async joinSpace(req, res) {
    logger.info(
      { user: req.user?.id, body: req.body },
      "Join space request received"
    );
    try {
      const userId = req.user?.id;
      const { space_id } = req.body;
      const member = await spaceMemberService.joinSpace(userId, space_id);
      logger.info({ member }, "User joined space successfully");
      await publishToQueue("space_member_events", {
        type: "space_member_joined",
        userId,
        space_id,
      });
      logger.info(
        { queue: "space_member_events", userId, space_id },
        "Space member event pushed to RabbitMQ"
      );
      res.send(member);
    } catch (err) {
      logger.error({ err }, "Failed to join space");
      res.status(500).send({ error: "Failed to join space" });
    }
  }

  // List members in a space
  async listMembers(req, res) {
    logger.info(
      { spaceId: req.params.spaceId },
      "List space members request received"
    );
    try {
      const spaceId = req.params.spaceId;
      const members = await spaceMemberService.listMembers(spaceId);
      logger.info({ members }, "Space members fetched successfully");
      res.send(members);
    } catch (err) {
      logger.error({ err }, "Failed to list space members");
      res.status(500).send({ error: "Failed to list space members" });
    }
  }
}
