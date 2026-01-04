import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Contento: A friendly policy assistant',
  description:
    'Your AI guide to creating policy-safe LinkedIn content. Get real-time feedback to ensure your posts align with community guidelines and professional standards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f3f2ef]">{children}</body>
    </html>
  );
}
