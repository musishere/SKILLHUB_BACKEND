"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseController = void 0;
const course_schema_1 = require("./course.schema");
const zod_1 = require("zod");
const SupaBase_1 = require("../../utils/SupaBase");
const createCourseController = async (request, reply) => {
    try {
        // ✅ Validate input using Zod
        const parsed = course_schema_1.createCourseSchema.parse({
            body: request.body,
        });
        // ✅ Ensure user is authenticated instructor
        const user = request.user; // Type override if needed
        if (!user || user.role !== "INSTRUCTOR") {
            return reply
                .status(403)
                .send({ error: "Only instructors can create courses" });
        }
        const { title, description, thumbnail_url, price, is_published } = parsed.body;
        const { data, error } = await SupaBase_1.supabase
            .from("courses")
            .insert([
            {
                title,
                description,
                thumbnail_url,
                price,
                is_published: is_published ?? false,
                instructor_id: user.id,
            },
        ])
            .select()
            .single();
        if (error) {
            console.error("Supabase insert error:", error);
            return reply.status(500).send({ error: "Failed to create course" });
        }
        return reply.status(201).send({
            message: "Course created successfully",
            course: data,
        });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return reply.status(400).send({ error: err.issues[0].message });
        }
        console.error("Unexpected error:", err);
        return reply.status(500).send({ error: "Internal server error" });
    }
};
exports.createCourseController = createCourseController;
