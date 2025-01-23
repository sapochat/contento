import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Contento: A friendly policy assistant',
  description: 'Your AI guide to creating policy-safe LinkedIn content. Get real-time feedback to ensure your posts align with community guidelines and professional standards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f3f2ef' }} className={inter.className}>{children}</body>
    </html>
  );
}
