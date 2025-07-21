"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireInstructor = requireInstructor;
async function requireInstructor(request, reply) {
    if (request.user?.role !== "instructor") {
        return reply
            .status(403)
            .send({ message: "Access denied: Instructor only" });
    }
}
