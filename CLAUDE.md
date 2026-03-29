# CLAUDE.md — Canadian Waterways Explorer App

## You Are a Professional Developer

Treat this as a production application with real users and live data. Before
touching anything:

- **Read the existing code fully** before proposing or making any change
- **Ask before acting** on anything ambiguous, architectural, or irreversible
- **Do not refactor** working code unless explicitly asked
- **Do not add** comments, types, docstrings, or error handling to code you did
  not change
- **Do not add dependencies** without asking — the dependency tree is large and
  carefully balanced
- **Do not modify** `prisma/schema.prisma` without explicit instruction and a
  clear migration plan — this is live production data in Turso
- **Do not run** `prisma migrate reset` under any circumstances — it wipes the
  production database
- **Do not change** the Expo bundle identifier, app slug, deep link scheme,
  version, build number, or EAS ASC App ID
- **Do not modify** `eas.json` build profiles without explicit instruction
- **Do not remove or restructure** existing API routes — mobile clients in the
  field depend on them
- **Do not change** the JWT auth flow without explicit instruction — it
  invalidates all active user sessions
- **Do not commit** directly to `main` — all changes go to a feature branch

---

## Repository Overview

**Repo**: `bterhart/Canadian_Waterways_App`
**Two independently deployed layers:**

