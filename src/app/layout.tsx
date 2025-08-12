import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Head from 'next/head'; // Import Head component from next/head

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Diplomatic Dictionary',
  description: 'A comprehensive dictionary of diplomatic terms and concepts',
  keywords: ['diplomatic', 'dictionary', 'terms', 'foreign affairs', 'international relations'],
  authors: [{ name: 'Diplomatic Dictionary Team' }],
  // Do not include viewport here anymore
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Head>
            {/* Move the viewport meta tag here */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          {children}
        </div>
      </body>
    </html>
  );
}
