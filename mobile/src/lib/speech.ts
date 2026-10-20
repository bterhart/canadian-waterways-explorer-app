// Read a source aloud (roadmap item 5). Two ways, tried in order:
//  1. the spoken copy made with the xAI voice the reader chose (GET /api/voices/:id/audio, an
//     mp3 on R2), played with expo-av; the server makes it on the first request, so the first
//     play of a passage can take a few seconds;
//  2. the phone's own synthesiser (expo-speech, added 2026-10-20 with the owner's approval)
//     when the server has no spoken copies or the request fails.
// One passage speaks at a time: starting another stops the first. Leaving the screen stops it.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { api } from '@/lib/api/api';
import { getNarratorVoice } from '@/lib/narrator';

export type ReadAloudState = 'idle' | 'loading' | 'playing';

/** The BCP 47 tag the synthesiser should use for a passage: French if it looks French, else Canadian English. */
export function speechLanguageFor(text: string): string {
  const sample = text.slice(0, 400).toLowerCase();
  const frenchMarkers = (sample.match(/\b(les|des|nous|vous|avec|dans|pour|sont|est|une|qui|que)\b/g) ?? []).length;
  const englishMarkers = (sample.match(/\b(the|and|with|were|was|which|that|they|have|from)\b/g) ?? []).length;
  return frenchMarkers > englishMarkers ? 'fr-CA' : 'en-CA';
}

let activeStop: (() => void) | null = null;
let audioModeSet = false;
async function prepareAudioMode() {
  if (audioModeSet) return;
  audioModeSet = true;
  try {
    // Play through the speaker even with the ring switch on silent: a class listening to Hearne
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false, staysActiveInBackground: false });
  } catch {
    // the default mode still plays
  }
}

/**
 * Speak `text` on demand. `documentId` names the checked transcription whose spoken copy to ask
 * the server for; without it only the phone's synthesiser is used.
 */
export function useReadAloud(text: string | null | undefined, documentId?: string | null) {
  const [state, setState] = useState<ReadAloudState>('idle');
  const stateRef = useRef<ReadAloudState>('idle');
  const soundRef = useRef<Audio.Sound | null>(null);
  const runRef = useRef(0);

  const setBoth = (s: ReadAloudState) => {
    stateRef.current = s;
    setState(s);
  };

  const stopRef = useRef<() => void>(() => undefined);
  const stop = useCallback(() => {
    runRef.current += 1;
    if (stateRef.current === 'idle') return;
    setBoth('idle');
    if (activeStop === stopRef.current) activeStop = null;
    const sound = soundRef.current;
    soundRef.current = null;
    if (sound) {
      sound.stopAsync().catch(() => undefined).finally(() => sound.unloadAsync().catch(() => undefined));
    }
    Speech.stop().catch(() => undefined);
  }, []);
  stopRef.current = stop;

  const speakWithPhone = useCallback((run: number) => {
    if (!text || run !== runRef.current) return;
    setBoth('playing');
    const finish = () => {
      if (run !== runRef.current) return;
      setBoth('idle');
      if (activeStop === stopRef.current) activeStop = null;
    };
    Speech.speak(text, { language: speechLanguageFor(text), rate: 0.92, onDone: finish, onStopped: finish, onError: finish });
  }, [text]);

  const start = useCallback(async () => {
    if (!text) return;
    activeStop?.();
    activeStop = stopRef.current;
    const run = ++runRef.current;
    setBoth('loading');
    if (documentId) {
      try {
        const { url } = await api.get<{ url: string; voice: string; generated: boolean }>(
          `/api/voices/${documentId}/audio?voice=${getNarratorVoice()}`,
        );
        if (run !== runRef.current) return;
        await prepareAudioMode();
        const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
        if (run !== runRef.current) {
          sound.unloadAsync().catch(() => undefined);
          return;
        }
        soundRef.current = sound;
        setBoth('playing');
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish && run === runRef.current) {
            soundRef.current = null;
            sound.unloadAsync().catch(() => undefined);
            setBoth('idle');
            if (activeStop === stopRef.current) activeStop = null;
          }
        });
        return;
      } catch {
        // no spoken copy on this server, or it could not be fetched: the phone reads it
        if (run !== runRef.current) return;
      }
    }
    speakWithPhone(run);
  }, [text, documentId, speakWithPhone]);

  const toggle = useCallback(() => {
    if (stateRef.current !== 'idle') stop();
    else void start();
  }, [start, stop]);

  // Stop when the component goes away or the passage changes
  useEffect(() => () => stopRef.current(), []);
  useEffect(() => {
    stopRef.current();
  }, [text, documentId]);

  return { state, speaking: state !== 'idle', toggle, start, stop };
}
