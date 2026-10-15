// "Mark as complete" for lessons and field trips. The server awards points,
// checks achievements and completes any matching class assignment; this device
// remembers the completion so the award happens once per resource.
import React, { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useCompleteFieldTrip, useCompleteLesson } from '@/lib/api/education-api';
import { useDeviceId } from '@/lib/identity';
import { isLocallyCompleted, markLocallyCompleted } from '@/lib/completion';
import type { CompletionResult } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  done: '#10B981',
};

interface Props {
  kind: 'lesson_plan' | 'field_trip';
  resourceId: string;
  label: string;
}

function describe(result: CompletionResult): string {
  const parts = [`+${result.activity.pointsAdded} points`];
  if (result.activity.rankedUp) parts.push(`New rank: ${result.activity.explorerRank}`);
  if (result.newAchievements.length > 0) {
    parts.push(`Achievement unlocked: ${result.newAchievements.map((a) => a.name).join(', ')}`);
  }
  if (result.assignmentsCompleted > 0) parts.push('Your teacher can see this is done.');
  return parts.join('\n');
}

export function MarkCompleteButton({ kind, resourceId, label }: Props) {
  const userId = useDeviceId();
  const [done, setDone] = useState<boolean | null>(null);
  const completeLesson = useCompleteLesson();
  const completeFieldTrip = useCompleteFieldTrip();
  const pending = completeLesson.isPending || completeFieldTrip.isPending;

  useEffect(() => {
    let active = true;
    isLocallyCompleted(kind, resourceId).then((v) => {
      if (active) setDone(v);
    });
    return () => {
      active = false;
    };
  }, [kind, resourceId]);

  const handlePress = async () => {
    if (!userId || done || pending) return;
    try {
      const result =
        kind === 'lesson_plan'
          ? await completeLesson.mutateAsync({ lessonId: resourceId, userId })
          : await completeFieldTrip.mutateAsync({ fieldTripId: resourceId, userId });
      await markLocallyCompleted(kind, resourceId);
      setDone(true);
      Alert.alert('Nice work!', describe(result));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Could not save your progress', message);
    }
  };

  if (done === null) return null; // still reading local state

  return (
    <Pressable
      style={[styles.button, done && styles.buttonDone, pending && styles.buttonPending]}
      onPress={handlePress}
      disabled={done || pending}
    >
      {pending ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <CheckCircle2 size={20} color="white" />
          <Text style={styles.text}>{done ? 'Completed' : label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonDone: {
    backgroundColor: colors.done,
  },
  buttonPending: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default MarkCompleteButton;
