/**
 * Global error handler for Fastify.
 * Logs errors with context, pushes to Redis, and returns a structured error response.
 * @param error - The error object
 * @param req - The Fastify request
 * @param reply - The Fastify reply
 */
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../utils/Logger";
import { pushErrorLog } from "../utils/redis";

export function globalErrorHandler(
  error: FastifyError & { statusCode?: number },
  req: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Log error with context
  logger.error(
    {
      err: error,
      url: req.url,
      method: req.method,
      user: (req as any).user || undefined,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      statusCode,
    },
    "Request error"
  );

  // Push error to Redis for monitoring
  pushErrorLog({
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    user: (req as any).user,
    time: new Date().toISOString(),
  });

  reply.status(statusCode).send({
    success: false,
    statusCode,
    message,
    // Only include stack in development
    ...(process.env.NODE_ENV === "development" && error.stack
      ? { stack: error.stack }
      : {}),
  });
}
