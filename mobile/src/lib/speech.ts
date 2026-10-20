// Read a source aloud with the phone's own speech synthesiser (expo-speech, added 2026-10-20 for
// roadmap item 5 with the owner's approval). One passage speaks at a time: starting another stops
// the first. Nothing is downloaded and no recording is made; the voice is the device's.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

/** The BCP 47 tag the synthesiser should use for a passage: French if it looks French, else Canadian English. */
export function speechLanguageFor(text: string): string {
  const sample = text.slice(0, 400).toLowerCase();
  const frenchMarkers = (sample.match(/\b(les|des|nous|vous|avec|dans|pour|sont|est|une|qui|que)\b/g) ?? []).length;
  const englishMarkers = (sample.match(/\b(the|and|with|were|was|which|that|they|have|from)\b/g) ?? []).length;
  return frenchMarkers > englishMarkers ? 'fr-CA' : 'en-CA';
}

let activeStop: (() => void) | null = null;

/**
 * Speak `text` on demand and report whether it is being spoken. `toggle` starts or stops;
 * leaving the screen stops it. Rate is a little under normal: these are 17th- to 19th-century
 * sentences read to a class.
 */
export function useReadAloud(text: string | null | undefined, language?: string) {
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  const stop = useCallback(() => {
    if (!speakingRef.current) return;
    speakingRef.current = false;
    setSpeaking(false);
    if (activeStop === stopRef.current) activeStop = null;
    Speech.stop().catch(() => undefined);
  }, []);
  const stopRef = useRef(stop);
  stopRef.current = stop;

  const start = useCallback(() => {
    if (!text) return;
    activeStop?.();
    activeStop = stopRef.current;
    speakingRef.current = true;
    setSpeaking(true);
    const finish = () => {
      if (!speakingRef.current) return;
      speakingRef.current = false;
      setSpeaking(false);
      if (activeStop === stopRef.current) activeStop = null;
    };
    Speech.speak(text, {
      language: language ?? speechLanguageFor(text),
      rate: 0.92,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });
  }, [text, language]);

  const toggle = useCallback(() => {
    if (speakingRef.current) stop();
    else start();
  }, [start, stop]);

  // Stop when the component goes away (screen left, card closed, passage changed)
  useEffect(() => () => stopRef.current(), []);
  useEffect(() => {
    stopRef.current();
  }, [text]);

  return { speaking, toggle, start, stop };
}
