// Application Error Service
// Handles application error log business logic
import {
  db,
  application_errors as applicationErrorsTable,
} from "../../db/Drizzle.config";

export class ApplicationErrorService {
  // List application errors
  async listApplicationErrors() {
    // Fetch from DB
    const errors = await db.select().from(applicationErrorsTable);
    return errors;
  }
}
