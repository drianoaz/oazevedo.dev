import type { Metadata } from 'next';
import { Cat } from '@/components/cat';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: 'O Azevedo',
  description: 'Desenvolvimento frontend moderno',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-stone-950 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Cat />
      </body>
    </html>
  );
}
