import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Elis } from '.';

describe('Elis', () => {
  it('renders without throwing', () => {
    expect(() => render(<Elis />)).not.toThrow();
  });

  it('root element has pointerEvents none', () => {
    const { container } = render(<Elis />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.pointerEvents).toBe('none');
  });

  it('renders no canvas element', () => {
    const { container } = render(<Elis />);
    expect(container.querySelector('canvas')).toBeNull();
  });
});
