/**
 * Advanced logger utility using pino for structured logging.
 * - Pretty prints in development
 * - Serializes errors
 * - Supports log levels (info, error, warn, debug)
 *
 * Usage: import { logger } from './utils/Logger';
 */
import pino from "pino";
import { config } from "./config";

const isDev = config.NODE_ENV === "development";

export const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
    target: "pino-pretty",
    options: {
          colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
      }
    : undefined,
  formatters: {
    level(label) {
      return { level: label };
    },
    log(object) {
      // Serialize errors for better logging
      if (object instanceof Error) {
        return {
          err: {
            message: object.message,
            stack: object.stack,
            ...object,
          },
        };
      }
      return object;
    },
  },
});
