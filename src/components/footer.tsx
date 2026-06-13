import Link from 'next/link';
import { siteName } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 text-sm text-stone-500">
        <span>
          © {new Date().getFullYear()} {siteName}
        </span>
        <nav className="flex gap-4">
          <Link
            href="/rss.xml"
            className="transition-colors hover:text-stone-300"
          >
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
