"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = courseRoutes;
const autheticate_1 = require("../../middleware/autheticate"); // ✅ fixed typo in filename
const course_controller_1 = require("./course.controller");
const course_schema_1 = require("./course.schema");
async function courseRoutes(fastify) {
    fastify.post("/api/courses", {
        preHandler: [autheticate_1.authenticate], // ✅ applies JWT + role check
        schema: {
            body: course_schema_1.createCourseSchema.shape.body,
        },
    }, course_controller_1.createCourseController);
}
