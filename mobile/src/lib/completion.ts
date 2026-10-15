// Remembers on the device which lessons / field trips this device already marked
// complete, so "Mark as complete" awards points once per resource.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@waterways_completed';

type Kind = 'lesson_plan' | 'field_trip';

const load = async (): Promise<Set<string>> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
};

export const isLocallyCompleted = async (kind: Kind, id: string): Promise<boolean> =>
  (await load()).has(`${kind}:${id}`);

export const markLocallyCompleted = async (kind: Kind, id: string): Promise<void> => {
  const set = await load();
  set.add(`${kind}:${id}`);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    // best effort; worst case the button re-appears after a restart
  }
};
