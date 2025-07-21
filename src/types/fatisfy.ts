import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      role: "admin" | "instructor" | "student";
      email: string;
    };
  }
}
