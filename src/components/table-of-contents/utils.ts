export function getLineOffset(depth: number): number {
  return depth >= 3 ? 10 : 0;
}

export function getItemOffset(depth: number): number {
  if (depth <= 2) {
    return 14;
  }

  if (depth === 3) {
    return 26;
  }

  return 36;
}
