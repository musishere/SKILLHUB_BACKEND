"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = void 0;
const zod_1 = require("zod");
// ==========================
// 🧾 Zod Schema: CreateCourse
// ==========================
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, "Title is required")
            .min(5, "Title must be at least 5 characters"),
        description: zod_1.z
            .string()
            .min(1, "Description is required")
            .min(10, "Description must be at least 10 characters"),
        thumbnail_url: zod_1.z.string().url("Thumbnail must be a valid URL").optional(),
        price: zod_1.z
            .number()
            .min(1, "Price is required")
            .nonnegative("Price cannot be negative"),
        is_published: zod_1.z.boolean().optional(),
    }),
});
