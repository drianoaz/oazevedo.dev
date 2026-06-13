import Link from 'next/link';
import { siteName } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-b border-stone-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-mono text-sm text-stone-100 transition-colors hover:text-white"
        >
          {siteName}
        </Link>
      </nav>
    </header>
  );
}
