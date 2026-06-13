import { expect, test } from 'vitest';
import { cn } from '@/lib/css';

test('vitest is configured', () => {
  expect(1 + 1).toBe(2);
});

test('alias @/* resolves', () => {
  expect(typeof cn).toBe('function');
});
