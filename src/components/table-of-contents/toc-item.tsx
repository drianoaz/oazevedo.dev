import { TocItem } from 'remark-flexible-toc';
import { cn } from '@/lib/css';
import { useTocContext } from './toc-provider';
import { getItemOffset, getLineOffset } from './utils';

export function ToCItem({
  item,
  upper = item.depth,
  lower = item.depth,
}: {
  item: TocItem;
  upper?: number;
  lower?: number;
}) {
  const { active } = useTocContext();

  const offset = getLineOffset(item.depth);
  const upperOffset = getLineOffset(upper);
  const lowerOffset = getLineOffset(lower);

  return (
    <a
      href={item.href}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
      data-active={active.includes(item.href.slice(1))}
      className="relative prose py-1.5 text-sm [overflow-wrap:anywhere] text-slate-400 transition-colors first:pt-0 last:pb-0 hover:text-white data-[active=true]:text-white"
    >
      {offset !== upperOffset ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="absolute start-0 -top-1.5 size-[17px]"
        >
          <line
            x1={upperOffset}
            y1="0"
            x2={offset}
            y2="11"
            className="stroke-slate-700"
            strokeWidth="1"
          />
        </svg>
      ) : null}
      <div
        className={cn(
          'absolute inset-y-0 w-px bg-slate-700',
          offset !== upperOffset && 'top-1.5',
          offset !== lowerOffset && 'bottom-1.5',
        )}
        style={{
          insetInlineStart: offset,
        }}
      />
      {item.value}
    </a>
  );
}
