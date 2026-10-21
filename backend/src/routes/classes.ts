import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { requireTeacher } from "../lib/teacher-middleware";
import { classBands } from "../lib/content-scope";
// "@prisma/client" below is the query library's generated types, not a database. Data lives in Turso.
import type { Teacher } from "@prisma/client";

const classesRouter = new Hono<{ Variables: { teacher: Teacher } }>();

// Helper function to generate a unique join code
function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validation schemas
const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  schoolYear: z.string().optional(),
  teacherId: z.string().optional(), // ignored: the authenticated teacher owns the class
});

const updateClassSchema = z.object({
  name: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
  schoolYear: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  // Content scope (spec 10.27): what the class's students see. contentBands null or [] means the class's own band.
  scopeMode: z.enum(["all", "bands", "assigned"]).optional(),
  contentBands: z.array(z.enum(["K-3", "4-6", "7-9", "10-12"])).optional().nullable(),
});

const joinClassSchema = z.object({
  joinCode: z.string().min(1, "Join code is required"),
  displayName: z.string().min(1, "Display name is required"),
  studentCode: z.string().optional(),
  // Anonymous device identity (mobile lib/identity.ts). Optional for older clients.
  userId: z.string().min(1).optional(),
});

const addStudentSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  studentCode: z.string().optional(),
});

const createAssignmentSchema = z.object({
  assignmentType: z.enum(["quiz", "lesson_plan", "field_trip"]),
  quizId: z.string().optional(),
  lessonPlanId: z.string().optional(),
  fieldTripId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  instructions: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  instructions: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

const updateProgressSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]),
  score: z.number().int().optional(),
  maxScore: z.number().int().optional(),
});

// POST /join - Student joins a class with join code (PUBLIC - no auth required)
classesRouter.post(
  "/join",
  zValidator("json", joinClassSchema),
  async (c) => {
    const { joinCode, displayName, studentCode, userId } = c.req.valid("json");

    const classToJoin = await db.class.findUnique({
      where: { joinCode },
    });

    if (!classToJoin) {
      return c.json(
        { error: { message: "Invalid join code", code: "INVALID_CODE" } },
        404
      );
    }

    if (!classToJoin.isActive) {
      return c.json(
        { error: { message: "This class is no longer active", code: "CLASS_INACTIVE" } },
        400
      );
    }

    // Same device joining the same class again: return the existing membership (idempotent).
    if (userId) {
      const alreadyMember = await db.classStudent.findFirst({
        where: { classId: classToJoin.id, userId },
      });
      if (alreadyMember) {
        return c.json({
          data: {
            student: alreadyMember,
            class: {
              id: classToJoin.id,
              name: classToJoin.name,
              gradeLevel: classToJoin.gradeLevel,
            },
          },
        });
      }
    }

    // Check if student with same display name already in class
    const existingStudent = await db.classStudent.findFirst({
      where: { classId: classToJoin.id, displayName },
    });

    if (existingStudent) {
      return c.json(
        { error: { message: "A student with this name already exists in this class", code: "DUPLICATE_NAME" } },
        400
      );
    }

    const student = await db.classStudent.create({
      data: {
        classId: classToJoin.id,
        displayName,
        studentCode,
        userId,
      },
    });

    return c.json({
      data: {
        student,
        class: {
          id: classToJoin.id,
          name: classToJoin.name,
          gradeLevel: classToJoin.gradeLevel,
        },
      },
    }, 201);
  }
);

// GET /mine?userId= - A student's class memberships with active assignments and progress
// (PUBLIC - keyed by the anonymous device identity, which is unguessable; see mobile lib/identity.ts)
classesRouter.get("/mine", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) {
    return c.json(
      { error: { message: "userId is required", code: "BAD_REQUEST" } },
      400
    );
  }

  const memberships = await db.classStudent.findMany({
    where: { userId },
    include: {
      class: {
        include: {
          teacher: { select: { name: true } },
          assignments: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            include: { lessonPlan: { select: { id: true, title: true } } },
          },
        },
      },
      progress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const data = memberships
    .filter((m) => m.class.isActive)
    .map((m) => ({
      student: { id: m.id, displayName: m.displayName, joinedAt: m.createdAt },
      class: {
        id: m.class.id,
        name: m.class.name,
        gradeLevel: m.class.gradeLevel,
        schoolYear: m.class.schoolYear,
        teacherName: m.class.teacher.name,
        // Content scope (spec 10.27), so the device can say what the class shows
        scopeMode: m.class.scopeMode,
        contentBands: classBands(m.class),
      },
      assignments: m.class.assignments.map((a) => {
        const p = m.progress.find((x) => x.assignmentId === a.id);
        return {
          id: a.id,
          classId: a.classId,
          assignmentType: a.assignmentType,
          quizId: a.quizId,
          lessonPlanId: a.lessonPlanId,
          fieldTripId: a.fieldTripId,
          lessonPlan: a.lessonPlan,
          title: a.title,
          instructions: a.instructions,
          dueDate: a.dueDate,
          isActive: a.isActive,
          createdAt: a.createdAt,
          progress: p
            ? { status: p.status, score: p.score, maxScore: p.maxScore, completedAt: p.completedAt }
            : null,
        };
      }),
    }));

  return c.json({ data });
});

// Require teacher authentication for all routes below this point
classesRouter.use("*", requireTeacher);

// POST / - Create a new class
classesRouter.post(
  "/",
  zValidator("json", createClassSchema),
  async (c) => {
    const data = c.req.valid("json");

    // The class belongs to the authenticated teacher; a teacherId in the body is ignored.
    const teacher = c.get("teacher");

    // Generate unique join code
    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.class.findUnique({
        where: { joinCode },
      });
      if (!existing) break;
      joinCode = generateJoinCode();
      attempts++;
    }

    const newClass = await db.class.create({
      data: {
        name: data.name,
        gradeLevel: data.gradeLevel,
        schoolYear: data.schoolYear,
        joinCode,
        teacherId: teacher.id,
      },
    });

    return c.json({ data: newClass }, 201);
  }
);

// GET /:id - Get class details
classesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const classData = await db.class.findUnique({
    where: { id },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      students: {
        orderBy: { displayName: "asc" },
      },
      assignments: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          // Per-student completion, written by the server when a student finishes the work.
          progress: {
            select: { studentId: true, status: true, score: true, maxScore: true, completedAt: true },
          },
        },
      },
    },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (classData.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  return c.json({ data: classData });
});

// PATCH /:id - Update class
classesRouter.patch(
  "/:id",
  zValidator("json", updateClassSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existingClass = await db.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }

    if (existingClass.teacherId !== c.get("teacher").id) {
      return c.json(
        { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
        403
      );
    }

    const updatedClass = await db.class.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.schoolYear !== undefined && { schoolYear: data.schoolYear }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.scopeMode !== undefined && { scopeMode: data.scopeMode }),
        ...(data.contentBands !== undefined && { contentBands: data.contentBands && data.contentBands.length > 0 ? JSON.stringify(data.contentBands) : null }),
      },
    });

    return c.json({ data: updatedClass });
  }
);

// DELETE /:id - Delete a class
classesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingClass = await db.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (existingClass.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  // Delete class within a transaction to ensure atomicity with cascading deletes
  await db.$transaction(async (tx) => {
    await tx.class.delete({
      where: { id },
    });
  });

  return c.json({ data: { success: true, message: "Class deleted successfully" } });
});

// POST /:id/regenerate-code - Regenerate join code
classesRouter.post("/:id/regenerate-code", async (c) => {
  const id = c.req.param("id");

  const existingClass = await db.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (existingClass.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db.class.findUnique({
      where: { joinCode },
    });
    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  const updatedClass = await db.class.update({
    where: { id },
    data: { joinCode },
  });

  return c.json({ data: { joinCode: updatedClass.joinCode } });
});

// GET /:id/students - Get all students in a class
classesRouter.get("/:id/students", async (c) => {
  const id = c.req.param("id");

  const classData = await db.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (classData.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  const students = await db.classStudent.findMany({
    where: { classId: id },
    include: {
      progress: {
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              assignmentType: true,
            },
          },
        },
      },
    },
    orderBy: { displayName: "asc" },
  });

  return c.json({ data: students });
});

// POST /:id/students - Add a student to a class
classesRouter.post(
  "/:id/students",
  zValidator("json", addStudentSchema),
  async (c) => {
    const id = c.req.param("id");
    const { displayName, studentCode } = c.req.valid("json");

    const classData = await db.class.findUnique({
      where: { id },
    });

    if (!classData) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }

    if (classData.teacherId !== c.get("teacher").id) {
      return c.json(
        { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
        403
      );
    }

    // Check for duplicate name
    const existingStudent = await db.classStudent.findFirst({
      where: { classId: id, displayName },
    });

    if (existingStudent) {
      return c.json(
        { error: { message: "A student with this name already exists in this class", code: "DUPLICATE_NAME" } },
        400
      );
    }

    const student = await db.classStudent.create({
      data: {
        classId: id,
        displayName,
        studentCode,
      },
    });

    return c.json({ data: student }, 201);
  }
);

// DELETE /:id/students/:studentId - Remove a student from a class
classesRouter.delete("/:id/students/:studentId", async (c) => {
  const classId = c.req.param("id");
  const studentId = c.req.param("studentId");

  const ownedClass = await db.class.findUnique({ where: { id: classId } });
  if (!ownedClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }
  if (ownedClass.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  const existingStudent = await db.classStudent.findFirst({
    where: { id: studentId, classId },
  });

  if (!existingStudent) {
    return c.json(
      { error: { message: "Student not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Delete student within a transaction to ensure atomicity with cascading deletes
  await db.$transaction(async (tx) => {
    await tx.classStudent.delete({
      where: { id: studentId },
    });
  });

  return c.json({ data: { success: true, message: "Student removed successfully" } });
});

// GET /:id/assignments - Get all assignments for a class
classesRouter.get("/:id/assignments", async (c) => {
  const id = c.req.param("id");

  const classData = await db.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (classData.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  const assignments = await db.classAssignment.findMany({
    where: { classId: id },
    include: {
      lessonPlan: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: { progress: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = assignments.map((a) => ({
    id: a.id,
    assignmentType: a.assignmentType,
    quizId: a.quizId,
    lessonPlanId: a.lessonPlanId,
    lessonPlan: a.lessonPlan,
    fieldTripId: a.fieldTripId,
    title: a.title,
    instructions: a.instructions,
    dueDate: a.dueDate,
    isActive: a.isActive,
    createdAt: a.createdAt,
    progressCount: a._count.progress,
  }));

  return c.json({ data: result });
});

// POST /:id/assignments - Create an assignment
classesRouter.post(
  "/:id/assignments",
  zValidator("json", createAssignmentSchema),
  async (c) => {
    const classId = c.req.param("id");
    const data = c.req.valid("json");

    const classData = await db.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }

    if (classData.teacherId !== c.get("teacher").id) {
      return c.json(
        { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
        403
      );
    }

    // Validate that the correct ID is provided for the assignment type
    if (data.assignmentType === "quiz" && !data.quizId) {
      return c.json(
        { error: { message: "Quiz ID is required for quiz assignments", code: "BAD_REQUEST" } },
        400
      );
    }
    if (data.assignmentType === "lesson_plan" && !data.lessonPlanId) {
      return c.json(
        { error: { message: "Lesson plan ID is required for lesson plan assignments", code: "BAD_REQUEST" } },
        400
      );
    }
    if (data.assignmentType === "field_trip" && !data.fieldTripId) {
      return c.json(
        { error: { message: "Field trip ID is required for field trip assignments", code: "BAD_REQUEST" } },
        400
      );
    }

    const assignment = await db.classAssignment.create({
      data: {
        classId,
        assignmentType: data.assignmentType,
        quizId: data.quizId,
        lessonPlanId: data.lessonPlanId,
        fieldTripId: data.fieldTripId,
        title: data.title,
        instructions: data.instructions,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return c.json({ data: assignment }, 201);
  }
);

// PATCH /:id/assignments/:assignmentId - Update an assignment
classesRouter.patch(
  "/:id/assignments/:assignmentId",
  zValidator("json", updateAssignmentSchema),
  async (c) => {
    const classId = c.req.param("id");
    const assignmentId = c.req.param("assignmentId");
    const data = c.req.valid("json");

    const ownedClass = await db.class.findUnique({ where: { id: classId } });
    if (!ownedClass) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }
    if (ownedClass.teacherId !== c.get("teacher").id) {
      return c.json(
        { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
        403
      );
    }

    const existingAssignment = await db.classAssignment.findFirst({
      where: { id: assignmentId, classId },
    });

    if (!existingAssignment) {
      return c.json(
        { error: { message: "Assignment not found", code: "NOT_FOUND" } },
        404
      );
    }

    const assignment = await db.classAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.instructions !== undefined && { instructions: data.instructions }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return c.json({ data: assignment });
  }
);

// DELETE /:id/assignments/:assignmentId - Delete an assignment
classesRouter.delete("/:id/assignments/:assignmentId", async (c) => {
  const classId = c.req.param("id");
  const assignmentId = c.req.param("assignmentId");

  const ownedClass = await db.class.findUnique({ where: { id: classId } });
  if (!ownedClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }
  if (ownedClass.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  const existingAssignment = await db.classAssignment.findFirst({
    where: { id: assignmentId, classId },
  });

  if (!existingAssignment) {
    return c.json(
      { error: { message: "Assignment not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Delete assignment within a transaction to ensure atomicity with cascading deletes
  await db.$transaction(async (tx) => {
    await tx.classAssignment.delete({
      where: { id: assignmentId },
    });
  });

  return c.json({ data: { success: true, message: "Assignment deleted successfully" } });
});

// GET /:id/progress - Get progress for all students and assignments in a class
classesRouter.get("/:id/progress", async (c) => {
  const id = c.req.param("id");

  const classData = await db.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  if (classData.teacherId !== c.get("teacher").id) {
    return c.json(
      { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
      403
    );
  }

  const progress = await db.studentProgress.findMany({
    where: {
      assignment: { classId: id },
    },
    include: {
      student: {
        select: {
          id: true,
          displayName: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          assignmentType: true,
        },
      },
    },
    orderBy: [{ student: { displayName: "asc" } }, { createdAt: "desc" }],
  });

  return c.json({ data: progress });
});

// PUT /:id/students/:studentId/progress/:assignmentId - Update student progress
classesRouter.put(
  "/:id/students/:studentId/progress/:assignmentId",
  zValidator("json", updateProgressSchema),
  async (c) => {
    const classId = c.req.param("id");
    const studentId = c.req.param("studentId");
    const assignmentId = c.req.param("assignmentId");
    const data = c.req.valid("json");

    const ownedClass = await db.class.findUnique({ where: { id: classId } });
    if (!ownedClass) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }
    if (ownedClass.teacherId !== c.get("teacher").id) {
      return c.json(
        { error: { message: "You can only manage your own classes", code: "FORBIDDEN" } },
        403
      );
    }

    // Verify student belongs to class
    const student = await db.classStudent.findFirst({
      where: { id: studentId, classId },
    });

    if (!student) {
      return c.json(
        { error: { message: "Student not found in this class", code: "NOT_FOUND" } },
        404
      );
    }

    // Verify assignment belongs to class
    const assignment = await db.classAssignment.findFirst({
      where: { id: assignmentId, classId },
    });

    if (!assignment) {
      return c.json(
        { error: { message: "Assignment not found in this class", code: "NOT_FOUND" } },
        404
      );
    }

    // Upsert progress within a transaction to ensure atomicity
    const progress = await db.$transaction(async (tx) => {
      return await tx.studentProgress.upsert({
        where: {
          studentId_assignmentId: {
            studentId,
            assignmentId,
          },
        },
        update: {
          status: data.status,
          ...(data.score !== undefined && { score: data.score }),
          ...(data.maxScore !== undefined && { maxScore: data.maxScore }),
          ...(data.status === "in_progress" && { startedAt: new Date() }),
          ...(data.status === "completed" && { completedAt: new Date() }),
        },
        create: {
          studentId,
          assignmentId,
          status: data.status,
          score: data.score,
          maxScore: data.maxScore,
          startedAt: data.status !== "not_started" ? new Date() : null,
          completedAt: data.status === "completed" ? new Date() : null,
        },
      });
    });

    return c.json({ data: progress });
  }
);

// GET /:id/report - Class report (roadmap item 11, 2026-10-21): who read what, quiz answers by
// question, journal entries, and assignment progress, for every student in the class. One JSON
// shape; the app renders it as CSV or PDF on the device. Students are matched to their work by the
// device id they joined with (ClassStudent.userId); a student added by name only has assignment rows.
classesRouter.get("/:id/report", async (c) => {
  const id = c.req.param("id");
  const cls = await db.class.findUnique({
    where: { id },
    include: {
      teacher: { select: { name: true } },
      students: { orderBy: { displayName: "asc" } },
      assignments: { where: { isActive: true }, orderBy: { createdAt: "asc" }, include: { lessonPlan: { select: { title: true } }, progress: true } },
    },
  });
  if (!cls) return c.json({ error: { message: "Class not found", code: "NOT_FOUND" } }, 404);
  if (cls.teacherId !== c.get("teacher").id) return c.json({ error: { message: "You can only manage your own classes", code: "FORBIDDEN" } }, 403);

  const userIds = cls.students.map((s) => s.userId).filter((u): u is string => !!u);
  const [quizTitles, tripTitles, attempts, journals, explorations] = await Promise.all([
    db.quiz.findMany({ where: { id: { in: cls.assignments.map((a) => a.quizId).filter((x): x is string => !!x) } }, select: { id: true, title: true } }),
    db.virtualFieldTrip.findMany({ where: { id: { in: cls.assignments.map((a) => a.fieldTripId).filter((x): x is string => !!x) } }, select: { id: true, title: true } }),
    userIds.length ? db.quizAttempt.findMany({ where: { userId: { in: userIds } }, orderBy: { createdAt: "asc" }, include: { quiz: { select: { title: true, questions: { select: { id: true, questionText: true, correctAnswer: true, orderIndex: true } } } } } }) : Promise.resolve([]),
    userIds.length ? db.studentJournal.findMany({ where: { studentIdentifier: { in: userIds } }, include: { entries: { orderBy: { createdAt: "asc" } } } }) : Promise.resolve([]),
    userIds.length ? db.userExploration.findMany({ where: { userId: { in: userIds } }, orderBy: { createdAt: "asc" } }) : Promise.resolve([]),
  ]);
  const quizTitle = new Map(quizTitles.map((q) => [q.id, q.title]));
  const tripTitle = new Map(tripTitles.map((t) => [t.id, t.title]));

  // Names for the records a device explored or read
  const idsBy = (type: string) => explorations.filter((e) => e.activityType === type).map((e) => e.resourceId);
  const [docs, waters, locs, journeys, pronunciations, lessons, trips] = await Promise.all([
    db.primarySourceDocument.findMany({ where: { id: { in: idsBy("document_read") } }, select: { id: true, title: true } }),
    db.waterway.findMany({ where: { id: { in: idsBy("waterway_explored") } }, select: { id: true, name: true } }),
    db.location.findMany({ where: { id: { in: idsBy("location_visited") } }, select: { id: true, name: true } }),
    db.voyageurJourney.findMany({ where: { id: { in: idsBy("journey_completed") } }, select: { id: true, title: true } }),
    db.pronunciationGuide.findMany({ where: { id: { in: idsBy("pronunciation_learned") } }, select: { id: true, term: true } }),
    db.lessonPlan.findMany({ where: { id: { in: idsBy("lesson_completed") } }, select: { id: true, title: true } }),
    db.virtualFieldTrip.findMany({ where: { id: { in: idsBy("field_trip_completed") } }, select: { id: true, title: true } }),
  ]);
  const nameOf = new Map<string, string>([
    ...docs.map((d) => [`document_read:${d.id}`, d.title] as const),
    ...waters.map((w) => [`waterway_explored:${w.id}`, w.name] as const),
    ...locs.map((l) => [`location_visited:${l.id}`, l.name] as const),
    ...journeys.map((j) => [`journey_completed:${j.id}`, j.title] as const),
    ...pronunciations.map((p) => [`pronunciation_learned:${p.id}`, p.term] as const),
    ...lessons.map((l) => [`lesson_completed:${l.id}`, l.title] as const),
    ...trips.map((t) => [`field_trip_completed:${t.id}`, t.title] as const),
  ]);
  const READING_LABELS: Record<string, string> = {
    document_read: "Document read", waterway_explored: "Waterway explored", location_visited: "Place visited", journey_completed: "Journey completed",
    pronunciation_learned: "Pronunciation learned", lesson_completed: "Lesson completed", field_trip_completed: "Field trip completed",
  };

  const students = cls.students.map((s) => {
    const mine = (userId: string | null) => (userId && s.userId ? userId === s.userId : false);
    return {
      id: s.id,
      displayName: s.displayName,
      joinedAt: s.createdAt,
      linkedToDevice: !!s.userId,
      assignments: cls.assignments.map((a) => {
        const p = a.progress.find((x) => x.studentId === s.id);
        return {
          id: a.id, title: a.title, type: a.assignmentType, dueDate: a.dueDate,
          resourceTitle: a.lessonPlan?.title ?? (a.quizId ? quizTitle.get(a.quizId) : a.fieldTripId ? tripTitle.get(a.fieldTripId) : null) ?? null,
          status: p?.status ?? "not_started", score: p?.score ?? null, maxScore: p?.maxScore ?? null, completedAt: p?.completedAt ?? null,
        };
      }),
      quizAttempts: attempts.filter((a) => mine(a.userId)).map((a) => {
        const answers = (() => { try { return JSON.parse(a.answers) as { questionId: string; selectedAnswer: string; isCorrect: boolean }[]; } catch { return []; } })();
        const qById = new Map(a.quiz.questions.map((q) => [q.id, q]));
        return {
          quizTitle: a.quiz.title, score: a.score, totalQuestions: a.totalQuestions, percentageScore: Math.round(a.percentageScore), completedAt: a.completedAt ?? a.createdAt,
          answers: answers.map((ans) => { const q = qById.get(ans.questionId); return { question: q?.questionText ?? ans.questionId, selectedAnswer: ans.selectedAnswer, correctAnswer: q?.correctAnswer ?? null, isCorrect: ans.isCorrect, orderIndex: q?.orderIndex ?? 0 }; }).sort((x, y) => x.orderIndex - y.orderIndex),
        };
      }),
      journalEntries: journals.filter((j) => mine(j.studentIdentifier)).flatMap((j) => j.entries.map((e) => ({ title: e.title, content: e.content, createdAt: e.createdAt, tags: (() => { try { return e.tags ? (JSON.parse(e.tags) as string[]) : []; } catch { return []; } })() }))),
      reading: explorations.filter((e) => mine(e.userId)).map((e) => ({ kind: e.activityType, label: READING_LABELS[e.activityType] ?? e.activityType, title: nameOf.get(`${e.activityType}:${e.resourceId}`) ?? e.resourceId, at: e.createdAt })),
    };
  });

  return c.json({
    data: {
      generatedAt: new Date(),
      class: { id: cls.id, name: cls.name, gradeLevel: cls.gradeLevel, schoolYear: cls.schoolYear, teacherName: cls.teacher.name },
      assignments: cls.assignments.map((a) => ({ id: a.id, title: a.title, type: a.assignmentType, dueDate: a.dueDate })),
      students,
      totals: {
        students: students.length, linkedToDevice: students.filter((s) => s.linkedToDevice).length,
        assignmentsCompleted: students.reduce((n, s) => n + s.assignments.filter((a) => a.status === "completed").length, 0),
        quizAttempts: students.reduce((n, s) => n + s.quizAttempts.length, 0),
        journalEntries: students.reduce((n, s) => n + s.journalEntries.length, 0),
        readingEvents: students.reduce((n, s) => n + s.reading.length, 0),
      },
    },
  });
});

export { classesRouter };
