// Device identity — the single anonymous id every student-side feature keys on
// (gamification, journal, maps, journeys, quiz attempts, class membership).
//
// Design (chosen 2026-10-15, "Option A"): no student accounts. One random,
// unguessable id is generated on first use and kept on the device. It is the
// only credential for student data, so it must be 128-bit random: expo-crypto's
// randomUUID() (RFC 4122 v4, 122 random bits).
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useEffect, useState } from 'react';

const DEVICE_ID_KEY = '@waterways_device_id';

let cached: string | null = null;
let pending: Promise<string> | null = null;

/** Returns the device id, generating and persisting one on first call. */
export const getDeviceId = (): Promise<string> => {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = (async () => {
      try {
        const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
        if (stored) {
          cached = stored;
          return stored;
        }
      } catch {
        // fall through to generate; a storage read failure must not block the app
      }
      const fresh = `dev_${Crypto.randomUUID()}`;
      try {
        await AsyncStorage.setItem(DEVICE_ID_KEY, fresh);
      } catch {
        // keep the in-memory id for this session even if persistence failed
      }
      cached = fresh;
      return fresh;
    })();
  }
  return pending;
};

/** React hook: null until the id has loaded, then the stable device id. */
export const useDeviceId = (): string | null => {
  const [id, setId] = useState<string | null>(cached);
  useEffect(() => {
    let active = true;
    getDeviceId().then((value) => {
      if (active) setId(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return id;
};
