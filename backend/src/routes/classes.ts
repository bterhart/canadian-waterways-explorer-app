import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const classesRouter = new Hono();

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
  teacherId: z.string().min(1, "Teacher ID is required"),
});

const updateClassSchema = z.object({
  name: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
  schoolYear: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const joinClassSchema = z.object({
  joinCode: z.string().min(1, "Join code is required"),
  displayName: z.string().min(1, "Display name is required"),
  studentCode: z.string().optional(),
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

// POST / - Create a new class
classesRouter.post(
  "/",
  zValidator("json", createClassSchema),
  async (c) => {
    const data = c.req.valid("json");

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });

    if (!teacher) {
      return c.json(
        { error: { message: "Teacher not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Generate unique join code
    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.class.findUnique({
        where: { joinCode },
      });
      if (!existing) break;
      joinCode = generateJoinCode();
      attempts++;
    }

    const newClass = await prisma.class.create({
      data: {
        name: data.name,
        gradeLevel: data.gradeLevel,
        schoolYear: data.schoolYear,
        joinCode,
        teacherId: data.teacherId,
      },
    });

    return c.json({ data: newClass }, 201);
  }
);

// POST /join - Student joins a class with join code
classesRouter.post(
  "/join",
  zValidator("json", joinClassSchema),
  async (c) => {
    const { joinCode, displayName, studentCode } = c.req.valid("json");

    const classToJoin = await prisma.class.findUnique({
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

    // Check if student with same display name already in class
    const existingStudent = await prisma.classStudent.findFirst({
      where: { classId: classToJoin.id, displayName },
    });

    if (existingStudent) {
      return c.json(
        { error: { message: "A student with this name already exists in this class", code: "DUPLICATE_NAME" } },
        400
      );
    }

    const student = await prisma.classStudent.create({
      data: {
        classId: classToJoin.id,
        displayName,
        studentCode,
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

// GET /:id - Get class details
classesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const classData = await prisma.class.findUnique({
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
      },
    },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
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

    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.schoolYear !== undefined && { schoolYear: data.schoolYear }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return c.json({ data: updatedClass });
  }
);

// DELETE /:id - Delete a class
classesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingClass = await prisma.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.class.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Class deleted successfully" } });
});

// POST /:id/regenerate-code - Regenerate join code
classesRouter.post("/:id/regenerate-code", async (c) => {
  const id = c.req.param("id");

  const existingClass = await prisma.class.findUnique({
    where: { id },
  });

  if (!existingClass) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.class.findUnique({
      where: { joinCode },
    });
    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  const updatedClass = await prisma.class.update({
    where: { id },
    data: { joinCode },
  });

  return c.json({ data: { joinCode: updatedClass.joinCode } });
});

// GET /:id/students - Get all students in a class
classesRouter.get("/:id/students", async (c) => {
  const id = c.req.param("id");

  const classData = await prisma.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  const students = await prisma.classStudent.findMany({
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

    const classData = await prisma.class.findUnique({
      where: { id },
    });

    if (!classData) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Check for duplicate name
    const existingStudent = await prisma.classStudent.findFirst({
      where: { classId: id, displayName },
    });

    if (existingStudent) {
      return c.json(
        { error: { message: "A student with this name already exists in this class", code: "DUPLICATE_NAME" } },
        400
      );
    }

    const student = await prisma.classStudent.create({
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

  const existingStudent = await prisma.classStudent.findFirst({
    where: { id: studentId, classId },
  });

  if (!existingStudent) {
    return c.json(
      { error: { message: "Student not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.classStudent.delete({
    where: { id: studentId },
  });

  return c.json({ data: { success: true, message: "Student removed successfully" } });
});

// GET /:id/assignments - Get all assignments for a class
classesRouter.get("/:id/assignments", async (c) => {
  const id = c.req.param("id");

  const classData = await prisma.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  const assignments = await prisma.classAssignment.findMany({
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

    const classData = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) {
      return c.json(
        { error: { message: "Class not found", code: "NOT_FOUND" } },
        404
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

    const assignment = await prisma.classAssignment.create({
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

    const existingAssignment = await prisma.classAssignment.findFirst({
      where: { id: assignmentId, classId },
    });

    if (!existingAssignment) {
      return c.json(
        { error: { message: "Assignment not found", code: "NOT_FOUND" } },
        404
      );
    }

    const assignment = await prisma.classAssignment.update({
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

  const existingAssignment = await prisma.classAssignment.findFirst({
    where: { id: assignmentId, classId },
  });

  if (!existingAssignment) {
    return c.json(
      { error: { message: "Assignment not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.classAssignment.delete({
    where: { id: assignmentId },
  });

  return c.json({ data: { success: true, message: "Assignment deleted successfully" } });
});

// GET /:id/progress - Get progress for all students and assignments in a class
classesRouter.get("/:id/progress", async (c) => {
  const id = c.req.param("id");

  const classData = await prisma.class.findUnique({
    where: { id },
  });

  if (!classData) {
    return c.json(
      { error: { message: "Class not found", code: "NOT_FOUND" } },
      404
    );
  }

  const progress = await prisma.studentProgress.findMany({
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

    // Verify student belongs to class
    const student = await prisma.classStudent.findFirst({
      where: { id: studentId, classId },
    });

    if (!student) {
      return c.json(
        { error: { message: "Student not found in this class", code: "NOT_FOUND" } },
        404
      );
    }

    // Verify assignment belongs to class
    const assignment = await prisma.classAssignment.findFirst({
      where: { id: assignmentId, classId },
    });

    if (!assignment) {
      return c.json(
        { error: { message: "Assignment not found in this class", code: "NOT_FOUND" } },
        404
      );
    }

    // Upsert progress
    const progress = await prisma.studentProgress.upsert({
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

    return c.json({ data: progress });
  }
);

export { classesRouter };
