import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Planet Mado RPG',
  description: 'An online DBZ-inspired RPG game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}