import { ClipboardCopyIcon, ClipboardIcon } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/css';

type Props = React.ComponentProps<'pre'> & {
  'data-code'?: string;
  'data-language'?: string;
  'data-filename'?: string;
  'data-no-copy'?: true;
};

export default function CodeBlock({ children, className, ...props }: Props) {
  const code = props['data-code'];
  const language = props['data-language'];
  const filename = props['data-filename'];
  const noCopy = props['data-no-copy'];

  const filePaths = filename ? filename.split('/') : [];

  const { copiedText, copyToClipboard, idle } = useCopyToClipboard();

  return (
    <figure className="group/code-block rounded-lg">
      {filePaths.length > 0 ? (
        <figcaption className="flex items-center justify-between rounded-t-lg bg-neutral-800 px-3 py-2 text-xs text-neutral-400">
          <div className="flex items-center">
            {filePaths.map((name, index) => {
              const isLast = index === filePaths.length - 1;
              return (
                <span
                  key={`${name}-${index}`}
                  className={cn(
                    'inline-flex items-center',
                    isLast && 'font-bold text-white',
                  )}
                >
                  {name}
                  {!isLast && <span className="px-1">/</span>}
                </span>
              );
            })}
          </div>
          <div className="text-md flex items-center justify-center gap-2">
            {language}
          </div>
        </figcaption>
      ) : null}
      <div className="relative">
        <pre
          {...props}
          className={cn(
            className,
            `not-prose relative overflow-x-auto rounded-lg p-4 text-sm ${
              filename ? 'mt-0 rounded-t-none' : ''
            }`,
          )}
        >
          {children}
        </pre>
        {code && !noCopy && (
          <button
            aria-label={copiedText}
            title={copiedText}
            tabIndex={0}
            disabled={!idle}
            onClick={() => {
              copyToClipboard(code);
            }}
            className={cn(
              'absolute top-3 right-3 inline-flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-700 p-2 text-sm text-neutral-500',
              idle &&
                'bg-neutral-800 opacity-0 group-hover/code-block:opacity-100 hover:bg-neutral-900',
              !idle && 'bg-neutral-900 opacity-100',
            )}
          >
            {idle ? (
              <ClipboardIcon size={20} />
            ) : (
              <>
                <span>{copiedText}</span>
                <ClipboardCopyIcon size={20} />
              </>
            )}
          </button>
        )}
      </div>
    </figure>
  );
}
