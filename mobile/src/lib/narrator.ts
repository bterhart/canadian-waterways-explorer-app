// Which narrator reads the sources aloud (roadmap item 5, owner 2026-10-20: "1 male and 1 female").
// A per-device preference, kept in AsyncStorage like the language, shared by every Read aloud
// button through a tiny store so a change in Settings or on a card applies everywhere at once.
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NarratorVoice = 'male' | 'female';
const STORAGE_KEY = '@waterways_narrator';

let current: NarratorVoice = 'male';
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === 'male' || saved === 'female') {
      current = saved;
      emit();
    }
  } catch {
    // keep the default
  }
}

export function setNarratorVoice(voice: NarratorVoice) {
  current = voice;
  emit();
  AsyncStorage.setItem(STORAGE_KEY, voice).catch(() => undefined);
}

export function getNarratorVoice(): NarratorVoice {
  return current;
}

export function useNarratorVoice(): [NarratorVoice, (v: NarratorVoice) => void] {
  void load();
  const voice = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => current,
  );
  return [voice, setNarratorVoice];
}
