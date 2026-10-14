# Archived one-off scripts

Historical scripts that were used to populate and repair the Turso database
(lesson-plan content, images, portraits, galleries, one-record fixes, probes).
Every one of them has already been run; none is needed to build, deploy or run
the application. They are kept for provenance only.

- `root/` — formerly `backend/*.ts`
- `prisma/` — formerly `backend/prisma/*.ts`
- `scripts/` — formerly `backend/scripts/*.ts`

Imports of `src/db` were re-pointed (`../../src/db`) so the tree still typechecks;
relative data-file paths (CSV inputs, `/tmp/...` maps, `/home/user/workspace/...`)
were NOT updated — these scripts are not meant to be run again. Each targets
specific record ids as they existed at the time it was written.

Scripts that embedded a Turso auth token, a Google API key, or a password were
deleted rather than archived (see `backend/SCRIPT_INVENTORY.md` §6). Verdicts and
per-file descriptions for everything here are in `backend/SCRIPT_INVENTORY.md`
(paths there refer to the pre-archive locations).
