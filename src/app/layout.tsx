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
    <html lang="fr" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full bg-[#C5E8EE] text-gray-900 antialiased">
        {/* Outer pastel canvas */}
        <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
          {/* Inner dark frame */}
          <div className="bg-[#0A0A0A] rounded-[28px] sm:rounded-[40px] overflow-hidden min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:min-h-[calc(100vh-64px)] flex flex-col">
            <TopBar />
            {/* White inner canvas */}
            <div className="flex-1 bg-white rounded-t-[24px] sm:rounded-t-[32px] mt-1 overflow-hidden relative">
              <main className="pb-32">{children}</main>
              <BottomNav />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
