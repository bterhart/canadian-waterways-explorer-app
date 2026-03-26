# Vibecode Workspace

This workspace contains a mobile app and backend server.

<projects>
  mobile/   — Expo React Native app (port 8081)
  backend/  — Hono API server (port 3000)
</projects>

<environment_variables>
  IMPORTANT: Use the correct env vars for each platform to avoid deployment failures.

  Backend (in backend/src/*.ts):
  - Use `env.BACKEND_URL` from "./env" (validated via Zod)
  - NEVER use `process.env.EXPO_PUBLIC_*` in backend code
  - These are available at runtime: BACKEND_URL, PORT, NODE_ENV

  Mobile (in mobile/src/*.ts):
  - Use `process.env.EXPO_PUBLIC_BACKEND_URL` for API calls
  - EXPO_PUBLIC_* vars are bundled at build time

  Testing backend endpoints:
  - Use $BACKEND_URL environment variable in cURL commands
  - Do NOT use localhost
</environment_variables>

<agents>
  Use subagents for project-specific work:
  - mobile-developer: Changes to the mobile app
  - backend-developer: Changes to the backend API

  Each agent reads its project's CLAUDE.md for detailed instructions.
  When waiting for subagent results with TaskOutput, use a timeout of 600000ms.
</agents>

<coordination>
  When a feature needs both frontend and backend:
  1. Design the API contract (endpoint, request/response shape) in backend/src/types.ts
  2. Implement backend route first, test using cURL with $BACKEND_URL (do not use localhost)
  3. Implement mobile client second
  4. Test the integration
</coordination>

<startup_triage>
  On every user message, you will receive a <startup_error_summary> block (plus raw expo/backend logs).
  If it contains startup-blocking errors (e.g. TS2307, "Cannot find module", ERR_MODULE_NOT_FOUND), fix those first.

  Legacy import compat (temporary; removable once all projects are migrated):
  - If a legacy project fails on an import like `@/shared/contracts`, do NOT use symlinks and do NOT patch tsconfig.
  - Prefer minimal, local, repo-contained fixes:
    - Mobile: create `mobile/src/shared/contracts.ts` and re-export types/constants already present in the mobile app.
    - Backend: if backend uses `@/* -> src/*`, create `backend/src/shared/contracts.ts` and re-export from the backend’s real contracts/types file; otherwise refactor the import to a correct relative path.
</startup_triage>

<skills>
  Shared skills in .claude/skills/:
  - database-auth: Set up Prisma + Better Auth for user accounts and data persistence
  - ai-apis-like-chatgpt: Use this skill when the user asks you to make an app that requires an AI API.
  - upload-assets: Use this skill when the user asks you to store and use assets like images, audio, videos, etc.

  Frontend only skills:
  - frontend-app-design: Create distinctive, production-grade React Native Expo interfaces following iOS Human Interface Guidelines and liquid glass design principles. Use when building mobile screens, components, or styling any React Native UI.
  - expo-docs: Use this skill when the user asks you to use an Expo SDK module or package that you might not know much about.
</skills>

<database>
  CRITICAL: There is ONE database. It is the external Turso database (libsql).
  - URL: TURSO_DATABASE_URL in backend/.env
  - The local file backend/prisma/prisma/dev.db is EMPTY and NEVER used.
  - NEVER query or update the local SQLite file. It has no data.
  - ALL database access must go through the backend Prisma client (backend/src/prisma.ts or backend/src/db.ts)
    which uses the @prisma/adapter-libsql Turso adapter.
  - To run a script against the real database, write a TS script in backend/prisma/ and run it with:
    cd backend && bun run prisma/your-script.ts
  - The DATABASE_URL env var points to the empty local file — ignore it. Use TURSO_DATABASE_URL.
</database>

<environment>
  System manages git and dev servers. DO NOT manage these.
  The user views the app through Vibecode App.
  The user cannot see code or terminal. Do everything for them.
  Communicate in an easy to understand manner for non-technical users.
  Be concise and don't talk too much.
  You are an expert coder. As such, you check your work to ensure it meets the task directive and instructions.
  As an expert, you never make any assumption about what functionality exists or does not exist. You check the entire applicaion to determine what exists and what doesn't before proceeding with any task.
  As an expert, you do not code for clarity and not cleverness.
  As an expert, you never proceed without acknowledging and summarizing the task you are being directed to do.
  As an expert, you do not take shortcuts and if you believe you must make an addition to application in any form (logic, code, functionality, UI, etc) you ask for confirmatino and clarity.
</environment>
