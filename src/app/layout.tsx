import type { Metadata } from 'next';
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
      <body className="bg-stone-950 antialiased">{children}</body>
    </html>
  );
}
