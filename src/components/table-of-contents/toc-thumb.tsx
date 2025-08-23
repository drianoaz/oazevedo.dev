import {
  type HTMLAttributes,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useOnChange } from '@/hooks/use-on-change';
import { useTocContext } from './toc-provider';

export type ToCThumbProps = [top: number, height: number];

function calc(container: HTMLElement, active: string[]): ToCThumbProps {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }

  let upper = Number.MAX_VALUE;
  let lower = 0;

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);

    if (!element) {
      continue;
    }

    const styles = getComputedStyle(element);
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom),
    );
  }

  return [upper, lower - upper];
}

function update(element: HTMLElement, info: ToCThumbProps): void {
  element.style.setProperty('--az-top', `${info[0]}px`);
  element.style.setProperty('--az-height', `${info[1]}px`);
}

export function TocThumb({
  containerRef,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { active } = useTocContext();
  const thumbRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback(() => {
    if (!containerRef.current || !thumbRef.current) {
      return;
    }

    update(thumbRef.current, calc(containerRef.current, active));
  }, [active, containerRef]);

  useEffect(
    function updateOnSizeChange() {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;

      onResize();

      const observer = new ResizeObserver(onResize);
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    },
    [containerRef, onResize],
  );

  useOnChange(active, () => {
    if (!containerRef.current || !thumbRef.current) {
      return;
    }

    update(thumbRef.current, calc(containerRef.current, active));
  });

  return <div ref={thumbRef} role="none" {...props} />;
}
