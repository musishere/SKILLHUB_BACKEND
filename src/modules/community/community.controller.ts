// Community Controller
// Handles community endpoints (collections, spaces, posts, etc.)
import { CommunityService } from "./community.service";

const communityService = new CommunityService();

export class CommunityController {
  // Get collections endpoint
  async getCollections(req, res) {
    try {
      const collections = await communityService.getCollections();
      res.send(collections);
    } catch (err) {
      res.status(500).send({ error: "Failed to get collections" });
    }
  }

  // Add collection endpoint
  async addCollection(req, res) {
    try {
      const data = req.body;
      const collection = await communityService.addCollection(data);
      res.send(collection);
    } catch (err) {
      res.status(500).send({ error: "Failed to add collection" });
    }
  }
}
