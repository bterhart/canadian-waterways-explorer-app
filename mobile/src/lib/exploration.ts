// Records "this device explored this record" once per app session per record, so a
// screen that re-renders or is reopened does not hammer the server. The server is the
// real guard (one UserExploration row per device, activity and record) and decides the
// points; this file only avoids repeat requests.
import { useEffect, useRef } from 'react';
import { useDeviceId } from '@/lib/identity';
import { useRecordExploration } from '@/lib/api/education-api';
import type { ExplorationActivity } from '@/lib/types/education';

const sent = new Set<string>();

/**
 * Fire the exploration call as soon as `resourceId` is known and `enabled` is true
 * (typically once the record's detail has loaded). Silent: progress shows on the
 * Achievements screen; nothing interrupts the content.
 */
export function useExploration(
  activityType: ExplorationActivity,
  resourceId: string | null | undefined,
  enabled: boolean = true
): void {
  const userId = useDeviceId();
  const record = useRecordExploration();
  const mutateRef = useRef(record.mutate);
  mutateRef.current = record.mutate;

  useEffect(() => {
    if (!enabled || !userId || !resourceId) return;
    const key = `${activityType}:${resourceId}`;
    if (sent.has(key)) return;
    sent.add(key);
    mutateRef.current(
      { userId, activityType, resourceId },
      {
        onError: () => {
          // Let a later visit retry.
          sent.delete(key);
        },
      }
    );
  }, [activityType, resourceId, enabled, userId]);
}

/** Imperative variant for explicit taps ("Mark as learned"). Resolves to the server's result. */
export function useExplorationAction(activityType: ExplorationActivity) {
  const userId = useDeviceId();
  const record = useRecordExploration();
  return {
    userId,
    isPending: record.isPending,
    record: (resourceId: string) => {
      if (!userId) return Promise.resolve(null);
      return record.mutateAsync({ userId, activityType, resourceId });
    },
  };
}
