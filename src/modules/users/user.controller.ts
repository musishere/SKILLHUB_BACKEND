// User Controller
// Handles user management endpoints
import { getSupabaseAdminClient } from "../../utils/SupaBase";
import { UserService } from "./user.service";
import { FastifyRequest, FastifyReply } from "fastify";

const userService = new UserService();

export class UserController {
  // Get user profile endpoint
  async getProfile(req: FastifyRequest, res: FastifyReply) {
    try {
      debugger; // Debugger for manual inspection
      const userId = (req as any).user?.id || (req.params as any).userId;
      const profile = await userService.getProfile(userId);
      res.send(profile);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getProfile error:", err); // Log the error for debugging
      res
        .status(500)
        .send({ error: "Failed to get profile", details: message });
    }
  }

  // Update user profile endpoint
  async updateProfile(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id || (req.params as any).userId;
      const data = req.body;
      await userService.updateProfile(userId, data);
      res.send({ status: "updated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res
        .status(500)
        .send({ error: "Failed to update profile", details: message });
    }
  }

  // Student dashboard endpoint
  async getStudentDashboard(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const supabase = await getSupabaseAdminClient();
      // Fetch enrollments for the user
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("status")
        .eq("user_id", userId);
      if (enrollmentsError) {
        console.error("Supabase enrollments error:", enrollmentsError);
        throw new Error(enrollmentsError.message);
      }
      const enrollmentsArr = enrollments || [];
      const inProgressCount = enrollmentsArr.filter(
        (e) => e.status !== "COMPLETED"
      ).length;
      const completedCount = enrollmentsArr.filter(
        (e) => e.status === "COMPLETED"
      ).length;
      // Fetch certificates for the user
      const { data: certificates, error: certError } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId);
      if (certError) {
        console.error("Supabase certificates error:", certError);
        throw new Error(certError.message);
      }
      const certificatesArr = certificates || [];
      // Fetch badges for the user
      const { data: badges, error: badgeError } = await supabase
        .from("badges")
        .select("id")
        .eq("user_id", userId);
      if (badgeError) {
        console.error("Supabase badges error:", badgeError);
        throw new Error(badgeError.message);
      }
      const badgesArr = badges || [];
      // Fetch minutes watched (from progress table)
      let minutesWatched = 0;
      try {
        const { data: progress, error: progressError } = await supabase
          .from("progress")
          .select("progress")
          .eq("user_id", userId);
        if (progressError) {
          if (
            progressError.message.includes(
              'relation "public.progress" does not exist'
            )
          ) {
            console.warn(
              "Progress table does not exist, setting minutesWatched to 0"
            );
          } else {
            console.error("Supabase progress error:", progressError);
            throw new Error(progressError.message);
          }
        } else {
          const progressArr = progress || [];
          minutesWatched = progressArr.reduce(
            (sum, p) => sum + Number(p.progress || 0),
            0
          );
        }
      } catch (progressCatchErr) {
        console.warn(
          "Progress table missing or error, minutesWatched set to 0"
        );
      }
      res.send({
        inProgressCount,
        inProgressPercent: 0,
        inProgressTotal: inProgressCount,
        completedCount,
        completedPercent: 0,
        completedTotal: completedCount,
        reviewsLeft: 0,
        reviewsPercent: 0,
        reviewsTotal: 0,
        badgesCount: badgesArr.length,
        badgesPercent: 0,
        badgesTotal: badgesArr.length,
        minutesWatched,
        minutesPercent: 0,
        minutesTotal: minutesWatched,
        commentsCount: 0,
        commentsPercent: 0,
        commentsTotal: 0,
        certificatesCount: certificatesArr.length,
        certificatesPercent: 0,
        certificatesTotal: certificatesArr.length,
        spent: 0,
        spentPercent: 0,
        spentTotal: 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getStudentDashboard error:", err);
      res
        .status(500)
        .send({ error: "Failed to get dashboard", details: message });
    }
  }

  // Certificates endpoint
  async getCertificates(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const supabase = await getSupabaseAdminClient();
      const { data: certificates, error } = await supabase
        .from("certificates")
        .select("id, title, issueddate, image")
        .eq("user_id", userId);
      if (error) {
        console.error("Supabase certificates error:", error);
        throw new Error(error.message);
      }
      res.send({ certificates: certificates || [] });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getCertificates error:", err);
      res
        .status(500)
        .send({ error: "Failed to get certificates", details: message });
    }
  }

  // Achievements endpoint
  async getAchievements(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const supabase = await getSupabaseAdminClient();
      const { data: achievements, error } = await supabase
        .from("achievements")
        .select("id, title, description, iconcolor")
        .eq("user_id", userId);
      if (error) {
        console.error("Supabase achievements error:", error);
        throw new Error(error.message);
      }
      res.send({ achievements: achievements || [] });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getAchievements error:", err);
      res
        .status(500)
        .send({ error: "Failed to get achievements", details: message });
    }
  }

  // In-progress content endpoint
  async getInProgressContent(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const supabase = await getSupabaseAdminClient();
      // Fetch enrollments for the user
      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Supabase enrollments error:", error);
        throw new Error(error.message);
      }
      const enrollmentsArr = enrollments || [];
      // If there are no enrollments, return empty arrays
      if (enrollmentsArr.length === 0) {
        return res.send({ inProgress: [], completed: [] });
      }
      // Fetch all course_ids
      const courseIds = enrollmentsArr.map((e) => e.course_id).filter(Boolean);
      let coursesMap: Record<string, any> = {};
      if (courseIds.length > 0) {
        const { data: courses, error: coursesError } = await supabase
          .from("courses")
          .select("id, title, thumbnail_url")
          .in("id", courseIds);
        if (coursesError) {
          console.error("Supabase courses error:", coursesError);
        } else {
          coursesMap = Object.fromEntries(
            (courses || []).map((c) => [c.id, c])
          );
        }
      }
      // Separate in-progress and completed
      const inProgress = [];
      const completed = [];
      for (const enr of enrollmentsArr) {
        const course = coursesMap[enr.course_id];
        if (!course) continue;
        const content = {
          id: course.id,
          category: "Course",
          title: course.title,
          progress: enr.status === "COMPLETED" ? 100 : 50,
          lastActivity: enr.updated_at || "-",
          image: course.thumbnail_url,
          svg: "course",
          textColor: "text-blue-600",
          bgColor: "bg-blue-100",
        };
        if (enr.status === "COMPLETED") completed.push(content);
        else inProgress.push(content);
      }
      res.send({ inProgress, completed });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getInProgressContent error:", err);
      res
        .status(500)
        .send({ error: "Failed to get in-progress content", details: message });
    }
  }

  // Reminders endpoint
  async getReminders(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const supabase = await getSupabaseAdminClient();
      const { data: remindersRow, error } = await supabase
        .from("reminders")
        .select("reminders")
        .eq("user_id", userId)
        .single();
      if (error && error.code !== "PGRST116") {
        if (error && error.code !== "PGRST116") {
          console.error("Supabase reminders error:", error);
        }
        throw new Error(error.message);
      }
      const reminders = remindersRow?.reminders || {
        M: { active: true, time: "7:15 PM" },
        T: { active: false, time: "" },
        W: { active: true, time: "3:30 PM" },
        Th: { active: false, time: "" },
        F: { active: true, time: "2:00 PM" },
        S: { active: false, time: "" },
        Su: { active: true, time: "7:15 PM" },
      };
      res.send({ reminders });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("getReminders error:", err);
      res
        .status(500)
        .send({ error: "Failed to get reminders", details: message });
    }
  }

  async updateReminders(req: FastifyRequest, res: FastifyReply) {
    try {
      const userId = (req as any).user?.id;
      const { reminders } = req.body as any;
      const supabase = await getSupabaseAdminClient();
      // Upsert reminders for the user
      const { error } = await supabase
        .from("reminders")
        .upsert({ user_id: userId, reminders })
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
      res.send({ status: "updated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res
        .status(500)
        .send({ error: "Failed to update reminders", details: message });
    }
  }
}
