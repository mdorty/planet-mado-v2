import './globals.css';
import { Inter } from 'next/font/google';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { AuthButtons } from '@/components/nav/auth-buttons';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

export const metadata = {
  title: 'Planet Mado RPG',
  description: 'An online DBZ-inspired RPG game',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' }
    ]
  },
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://game.planetmado.com' : 'http://localhost:3003')
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <TRPCProvider>
          <SessionProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <a href="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors">
                  Planet Mado
                </a>
                <AuthButtons />
              </nav>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            </div>
          </SessionProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}