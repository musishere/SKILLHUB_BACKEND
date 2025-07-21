"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const SupaBase_1 = require("../../utils/SupaBase");
class CourseService {
    /**
     * Inserts a new course for the given instructor
     */
    static async createCourse(input, instructorId) {
        const { title, description, thumbnail_url, price, is_published = false, } = input;
        const { data, error } = await SupaBase_1.supabase
            .from("courses")
            .insert({
            instructor_id: instructorId,
            title,
            description,
            thumbnail_url,
            price,
            is_published,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create course: ${error.message}`);
        }
        return data;
    }
    /**
     * Fetch all published courses
     */
    static async getAllPublishedCourses() {
        const { data, error } = await SupaBase_1.supabase
            .from("courses")
            .select("*")
            .eq("is_published", true)
            .order("created_at", { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch courses: ${error.message}`);
        }
        return data;
    }
}
exports.CourseService = CourseService;
