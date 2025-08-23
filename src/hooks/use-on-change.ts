import { useState } from 'react';

/**
 * Compares two values to determine if they are different.
 * Performs a shallow comparison for primitive values and a recursive comparison for arrays.
 *
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @returns {boolean} Returns true if the values are different, otherwise false.
 */
function isDifferent(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length !== a.length || a.some((v, i) => isDifferent(v, b[i]));
  }

  return a !== b;
}

/**
 * Custom hook to detect changes in a value and execute a callback when the change occurs.
 *
 * @template T Type of the value being watched.
 * @param value The value (state) to observe.
 * @param onChange Callback function called when the value changes. Receives the current and previous values as arguments.
 * @param isUpdated Optional function to determine if the value has been updated. Defaults to a shallow comparison (`isDifferent`).
 *
 * @description
 * Unlike `useEffect`, which relies on a dependency array and runs its effect after the component commit phase,
 * this hook executes the callback immediately during render if the `isUpdated` function detects a change.
 * This allows for more customized change detection logic than what `useEffect` provides.
 *
 * Note: Since the callback is executed during render, avoid side effects that could cause render loops.
 */
export function useOnChange<T>(
  value: T,
  onChange: (current: T, previous: T) => void,
  isUpdated: (prev: T, current: T) => boolean = isDifferent,
): void {
  const [prev, setPrev] = useState<T>(value);

  if (isUpdated(prev, value)) {
    onChange(value, prev);
    setPrev(value);
  }
}
