import { useCallback, useEffect, useState } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { emptyLogState, reduceSandpackMessage, type SandpackMessage } from './sandpackLogState';

/**
 * Console output of the current Sandpack preview as LogEntries (see
 * reduceSandpackMessage for when it resets). Listens to raw messages instead of
 * useSandpackConsole because that hook drops the referenced objects cyclic
 * values need (see fromSandpack.ts).
 */
export function useSandpackLogs() {
  const { listen } = useSandpack();
  const [state, setState] = useState(emptyLogState);

  const clear = useCallback(() => setState(emptyLogState()), []);

  useEffect(() => listen((message) => setState((s) => reduceSandpackMessage(s, message as SandpackMessage))), [listen]);

  return { entries: state.entries, clear };
}
