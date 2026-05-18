import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
  themeColor: '#C5E8EE',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full bg-[#0A0A0A]`}>
      <body className="min-h-full bg-[#0A0A0A] text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col bg-[#0A0A0A] px-[5px] pb-[28px] relative">
          <TopBar />
          {/* White inner canvas with rounded corners on all sides */}
          <div className="flex-1 bg-white rounded-[24px] sm:rounded-[28px] mt-[5px] overflow-hidden relative">
            <main className="pb-32">{children}</main>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
