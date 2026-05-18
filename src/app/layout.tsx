import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { TopBar } from '@/components/top-bar';
import { BottomToolbar } from '@/components/bottom-toolbar';
import { PomodoroProvider } from '@/lib/pomodoro-context';
import { FloatingTimer } from '@/components/floating-timer';

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
    <html lang="fr" className={`${jakarta.variable} h-full bg-[#0A0A0A] overflow-hidden`}>
      <body className="h-full bg-[#0A0A0A] text-gray-900 antialiased overflow-hidden">
        <PomodoroProvider>
          <div className="h-screen w-screen flex flex-col bg-[#0A0A0A]">
            {/* Top fixed */}
            <TopBar />

            {/* Middle: white panel where ONLY the content scrolls */}
            <div className="flex-1 px-[5px] mt-[5px] min-h-0 flex">
              <div className="flex-1 bg-white rounded-[24px] sm:rounded-[28px] overflow-y-auto overflow-x-hidden relative">
                <main className="pb-6">{children}</main>
              </div>
            </div>

            {/* Bottom black band — toolbox fully embedded inside */}
            <div className="flex-shrink-0 flex items-center justify-center px-[5px] pt-2 pb-3">
              <BottomToolbar />
            </div>
          </div>
          {/* Floating Pomodoro pill — visible whenever a session is running */}
          <FloatingTimer />
        </PomodoroProvider>
      </body>
    </html>
  );
}
