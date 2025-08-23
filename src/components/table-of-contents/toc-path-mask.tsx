import { RefObject, useEffect, useState } from 'react';
import { useTocContext } from './toc-provider';
import { TocThumb } from './toc-thumb';
import { getLineOffset } from './utils';

export type ToCPathMaskProps = {
  containerRef: RefObject<HTMLElement | null>;
};

export function ToCPathMask({ containerRef }: ToCPathMaskProps) {
  const { toc } = useTocContext();

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  useEffect(
    function buildSVG() {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;

      function onResize(): void {
        if (container.clientHeight === 0) {
          return;
        }

        let w = 0;
        let h = 0;

        const d: string[] = [];

        for (let i = 0; i < toc.length; i++) {
          const element = container.querySelector<HTMLElement>(
            `a[href="#${toc[i].href.slice(1)}"]`,
          );

          if (!element) {
            continue;
          }

          const styles = getComputedStyle(element);
          const offset = getLineOffset(toc[i].depth) + 0.5;
          const top = element.offsetTop + parseFloat(styles.paddingTop);
          const bottom =
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom);

          w = Math.max(offset, w);
          h = Math.max(h, bottom);

          d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
          d.push(`L${offset} ${bottom}`);
        }

        setSvg({
          path: d.join(' '),
          width: w + 1,
          height: h,
        });
      }

      const observer = new ResizeObserver(onResize);

      onResize();
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    },
    [toc, containerRef],
  );

  if (!svg) {
    return null;
  }

  return (
    <div
      className="absolute start-0 top-0 z-20"
      style={{
        width: svg.width,
        height: svg.height,
        maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`)}")`,
      }}
    >
      <TocThumb
        containerRef={containerRef}
        className="mt-(--az-top) h-(--az-height) bg-white transition-all"
      />
    </div>
  );
}
