import { Hono } from "hono";
import { cors } from "hono/cors";
import "./env";
import { sampleRouter } from "./routes/sample";
import { waterwaysRouter } from "./routes/waterways";
import { locationsRouter } from "./routes/locations";
import { explorersRouter } from "./routes/explorers";
import { indigenousRouter } from "./routes/indigenous";
import { contributionsRouter } from "./routes/contributions";
import { adminRouter } from "./routes/admin";
import { adminApprovalRouter } from "./routes/admin-approval";
import { discoveriesRouter } from "./routes/discoveries";
import { quizzesRouter } from "./routes/quizzes";
import { adminQuizzesRouter } from "./routes/admin-quizzes";
import { lessonPlansRouter } from "./routes/lesson-plans";
import { adminLessonPlansRouter } from "./routes/admin-lesson-plans";
import { timelineRouter } from "./routes/timeline";
import { fieldTripsRouter } from "./routes/field-trips";
import { adminFieldTripsRouter } from "./routes/admin-field-trips";
import { documentsRouter } from "./routes/documents";
import { adminDocumentsRouter } from "./routes/admin-documents";
import { comparisonsRouter } from "./routes/comparisons";
import { journalsRouter } from "./routes/journals";
import { teachersRouter } from "./routes/teachers";
import { teacherApprovalRouter } from "./routes/teacher-approval";
import { classesRouter } from "./routes/classes";
import { printablesRouter } from "./routes/printables";
import { adminPrintablesRouter } from "./routes/admin-printables";
import { pronunciationsRouter } from "./routes/pronunciations";
import { indigenousLanguageRouter } from "./routes/indigenous-language";
import { gamificationRouter } from "./routes/gamification";
import { voyageurJourneyRouter } from "./routes/voyageur-journey";
import { mapAnnotationsRouter } from "./routes/map-annotations";
import { nearbyHistoryRouter } from "./routes/nearby-history";
import { notableFiguresRouter } from "./routes/notable-figures";
import { authRouter } from "./routes/auth";
import { adminImageHealthRouter } from "./routes/admin-image-health";
import { scheduleImageHealthCheck } from "./jobs/image-health-check";
import { logger } from "hono/logger";
import { readFileSync } from "fs";
import { join } from "path";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/,
];

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowed.some((re) => re.test(origin)) ? origin : null),
    credentials: true,
  })
);

// Logging
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Temporary: download image export CSV
app.get("/admin/image-export-csv", (c) => {
  try {
    const csv = readFileSync(join(import.meta.dir, "../prisma/image-export.csv"), "utf-8");
    c.header("Content-Type", "text/csv");
    c.header("Content-Disposition", "attachment; filename=\"image-export.csv\"");
    return c.body(csv);
  } catch {
    return c.json({ error: "CSV not found" }, 404);
  }
});

// Serve KML admin panel
app.get("/admin/kml", (c) => {
  const html = readFileSync(join(import.meta.dir, "admin-panel.html"), "utf-8");
  return c.html(html);
});

// Routes
app.route("/api/sample", sampleRouter);
app.route("/api/auth", authRouter);
app.route("/api/waterways", waterwaysRouter);
app.route("/api/locations", locationsRouter);
app.route("/api/explorers", explorersRouter);
app.route("/api/indigenous", indigenousRouter);
app.route("/api/contributions", contributionsRouter);
app.route("/api/admin", adminRouter);
app.route("/api/admin-approval", adminApprovalRouter);
app.route("/api/discoveries", discoveriesRouter);
app.route("/api/quizzes", quizzesRouter);
app.route("/api/admin/quizzes", adminQuizzesRouter);

// Educational features routes
app.route("/api/lesson-plans", lessonPlansRouter);
app.route("/api/admin/lesson-plans", adminLessonPlansRouter);
app.route("/api/timeline", timelineRouter);
app.route("/api/field-trips", fieldTripsRouter);
app.route("/api/admin/field-trips", adminFieldTripsRouter);
app.route("/api/documents", documentsRouter);
app.route("/api/admin/documents", adminDocumentsRouter);
app.route("/api/comparisons", comparisonsRouter);
app.route("/api/journals", journalsRouter);
app.route("/api/teachers", teachersRouter);
app.route("/api/teacher-approval", teacherApprovalRouter);
app.route("/api/classes", classesRouter);
app.route("/api/printables", printablesRouter);
app.route("/api/admin/printables", adminPrintablesRouter);
app.route("/api/pronunciations", pronunciationsRouter);
app.route("/api/indigenous-language", indigenousLanguageRouter);
app.route("/api/gamification", gamificationRouter);
app.route("/api/voyageur-journeys", voyageurJourneyRouter);
app.route("/api/map-annotations", mapAnnotationsRouter);
app.route("/api/nearby-history", nearbyHistoryRouter);
app.route("/api/notable-figures", notableFiguresRouter);
app.route("/api/admin/image-health", adminImageHealthRouter);

// Schedule daily image URL health check (runs at 02:00 server time)
scheduleImageHealthCheck();

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
