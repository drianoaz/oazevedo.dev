import { SquareChevronUpIcon, TextIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { TocItem } from 'remark-flexible-toc';
import { useAnchorObserver } from '@/hooks/use-anchor-observer';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { ToCItem } from './toc-item';
import { ToCPathMask } from './toc-path-mask';
import { TocContext } from './toc-provider';

type TableOfConentsProps = {
  toc: TocItem[];
};

export function TableOfContents({ toc }: TableOfConentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useScrollPosition();

  const headings = useMemo(() => {
    return toc.map((item) => {
      return item.href.split('#')[1];
    });
  }, [toc]);

  const active = useAnchorObserver(headings);

  const showScrollToTop = scrollPosition > 200;

  return (
    <div className="sticky top-0 hidden w-xs shrink-0 p-6 xl:block">
      <div className="flex items-center gap-2 pb-4">
        <TextIcon className="size-5 text-slate-400" />
        <p className="text-sm text-slate-400">Nesta página</p>
      </div>
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
          <button
            className={`mt-4 flex cursor-pointer items-center gap-x-1.5 text-sm text-slate-400 transition-all duration-300 ease-in-out hover:text-white ${
              showScrollToTop
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-2 opacity-0'
            }`}
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <SquareChevronUpIcon className="size-5" /> Voltar ao topo
          </button>
        </TocContext.Provider>
      </div>
    </div>
  );
}
