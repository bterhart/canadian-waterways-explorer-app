#!/usr/bin/env bash
# migration-monitor.sh
# Keeps migrate-from-csv.ts running until it exits 0 (completion).
# Re-copies the CSV from the persistent repo location to /tmp on each start.

PERSISTENT_CSV="/home/user/workspace/backend/prisma/cleaned-urls.csv"
TMP_CSV="/tmp/cleaned-urls.csv"
LOG="/tmp/migration.log"
SCRIPT_DIR="/home/user/workspace/backend"

echo "[monitor] Started at $(date -u)" >> "$LOG"

while true; do
  # Ensure CSV is in /tmp
  cp "$PERSISTENT_CSV" "$TMP_CSV"

  echo "[monitor] Launching migrate-from-csv.ts at $(date -u)" >> "$LOG"

  cd "$SCRIPT_DIR" && bun run prisma/migrate-from-csv.ts >> "$LOG" 2>&1
  EXIT_CODE=$?

  if [ "$EXIT_CODE" -eq 0 ]; then
    echo "[monitor] Migration completed successfully at $(date -u)" >> "$LOG"
    touch /tmp/migration-complete
    exit 0
  fi

  echo "[monitor] Process exited with code $EXIT_CODE at $(date -u). Restarting in 10s…" >> "$LOG"
  sleep 10
done
