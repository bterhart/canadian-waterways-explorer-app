import "@vibecodeapp/proxy"; // DO NOT REMOVE OTHERWISE VIBECODE PROXY WILL NOT WORK
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
import { discoveriesRouter } from "./routes/discoveries";
import { logger } from "hono/logger";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.dev\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.run$/,
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

// Routes
app.route("/api/sample", sampleRouter);
app.route("/api/waterways", waterwaysRouter);
app.route("/api/locations", locationsRouter);
app.route("/api/explorers", explorersRouter);
app.route("/api/indigenous", indigenousRouter);
app.route("/api/contributions", contributionsRouter);
app.route("/api/admin", adminRouter);
app.route("/api/discoveries", discoveriesRouter);

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
