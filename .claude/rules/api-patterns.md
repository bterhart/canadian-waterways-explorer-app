# API Contract Patterns

Shared conventions for API communication between the Hono backend (`backend/src`)
and the Expo client (`mobile/src/lib/api`). Everything below was verified against
the code on 2026-10-14; if the code and this file disagree, the code wins — fix
this file.

<database>
  The one and only database is Turso (libSQL cloud).
  Backend reaches it through `backend/src/db.ts` (`@prisma/client` +
  `@prisma/adapter-libsql`, exported as `db`). "Prisma" is the name of that
  query library — there is no Prisma database, no local SQLite, no DATABASE_URL.
  `backend/prisma/schema.prisma` is a declaration used by `bunx prisma generate`
  to build the typed client; it is NOT the source of truth for what exists in
  Turso. There is no `prisma/migrations` directory and nothing runs
  `prisma migrate` or `prisma db push`. Schema changes reach Turso only via
  `backend/scripts/push-turso-schema.ts` (hand-written SQL, CREATE-only).

  Startup issue: if routes 404 but /health works, the typed client was not
  generated → `cd backend && bunx prisma generate` and restart.
</database>

<response_envelope>
  Success: c.json({ data: value })            // client unwraps to `value`
  Explicit errors: c.json({ error: { message, code } }, 4xx)

  Exceptions:
  - zod validation failures (every zValidator route) use @hono/zod-validator's
    default hook → { "success": false, "error": { "name": "ZodError", "message": "[…issues…]" } }
    The client surfaces `error.message` verbatim, i.e. a stringified issues array.
  - Unhandled throws: no app.onError is registered → text/plain "Internal Server Error".
  - 204 No Content; non-JSON (use api.raw()).

  Client typing: type the inner value only.
  ✅ api.get<Post[]>('/api/posts')
  ❌ api.get<{ data: Post[] }>()
</response_envelope>

<auth>
  Custom JWT, not Better Auth. See backend/src/lib/jwt-utils.ts, auth-utils.ts,
  admin-middleware.ts, teacher-middleware.ts.
  - Admin login: POST /api/admin/login → { accessToken, refreshToken, admin }
  - Teacher login: POST /api/teachers/login → { accessToken, refreshToken, teacher }
  - Access token lifetime 15 min; refresh 7 days; POST /api/auth/refresh, /api/auth/logout.
  - Guards: requireAdmin, requireSuperAdmin, requireTeacher (Bearer header).
  - Token blacklist and rate limiters are in-memory (reset on restart).
  - Client sends the token via setAuthToken() in mobile/src/lib/api/api.ts; the
    client does not currently refresh tokens.
</auth>

<cors>
  backend/src/index.ts allows only http://localhost:*, http://127.0.0.1:* and
  https://*.up.railway.app. Native apps send no Origin and are unaffected.
  Echo the specific origin, never "*", when credentials are involved.
</cors>

<done_gate>
  `bun run typecheck` in backend/ and mobile/ must not introduce new errors
  (pre-existing errors live only in dead scripts), and the touched flow must be
  exercised end-to-end (local backend on :3000 at minimum).
</done_gate>
