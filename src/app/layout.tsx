import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MELA — My English Learning for Australia',
  description: "12 semaines pour passer de A2 à B1 et débloquer ton anglais. Cap sur l'Australie.",
  applicationName: 'MELA',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FBFBFD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD] text-gray-900 antialiased">
        <TopBar />
        <main className="flex-1 pb-28">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
