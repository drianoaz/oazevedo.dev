import type { Metadata } from 'next';
import Link from 'next/link';
import { baseUrl, siteName } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Desenvolvimento frontend moderno',
  alternates: {
    types: {
      'application/rss+xml': `${baseUrl}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-stone-950 text-gray-200 antialiased xl:grid xl:grid-cols-[1fr_auto_minmax(20rem,1fr)] xl:grid-rows-[auto_1fr_auto]">
        <header className="mx-auto w-full max-w-3xl px-4 py-6 xl:col-start-2 xl:max-w-none">
          <Link href="/" className="font-semibold text-white">
            {siteName}
          </Link>
        </header>
        <main className="flex-1 xl:col-span-full xl:grid xl:grid-cols-subgrid xl:content-start">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-3xl gap-4 px-4 py-8 text-sm text-gray-400 xl:col-start-2 xl:max-w-none">
          <span>{`© ${new Date().getFullYear()} Adriano de Azevedo`}</span>
          <a href="/rss.xml" className="hover:text-white">
            RSS
          </a>
        </footer>
      </body>
    </html>
  );
}
