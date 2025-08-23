import { useMemo, useRef } from 'react';
import { TocItem } from 'remark-flexible-toc';
import { useAnchorObserver } from '@/hooks/use-anchor-observer';
import { ToCItem } from './toc-item';
import { ToCPathMask } from './toc-path-mask';
import { TocContext } from './toc-provider';

type TableOfConentsProps = {
  toc: TocItem[];
};

export function TableOfContents({ toc }: TableOfConentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const headings = useMemo(() => {
    return toc.map((item) => {
      return item.href.split('#')[1];
    });
  }, [toc]);

  const active = useAnchorObserver(headings);

  return (
    <div className="sticky top-0 hidden w-xs shrink-0 p-6 xl:block">
      <div className="relative">
        <TocContext.Provider
          value={{
            active,
            toc,
          }}
        >
          <ToCPathMask containerRef={containerRef} />
          <div ref={containerRef} className="flex flex-col">
            {toc.map((item, i) => (
              <ToCItem
                key={item.href}
                item={item}
                upper={toc[i - 1]?.depth}
                lower={toc[i + 1]?.depth}
              />
            ))}
          </div>
        </TocContext.Provider>
      </div>
    </div>
  );
}
