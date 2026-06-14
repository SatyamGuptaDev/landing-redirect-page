import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'ZivoxTV | Watch Top Trending Movies & TV Shows Free',
  description: 'Watch free movies online and stream full classic TV shows at ZivoxTV. The best streaming destination for free movies to watch online, classic films, and trending series in full HD.',
  keywords: 'watch free movies online, free movies to watch, free online movies, watch series free online, stream full movies free, best classic movies free, watch tv shows online free, full hd movies free, ZivoxTV',
  openGraph: {
    title: 'ZivoxTV | Watch Top Trending Movies & TV Shows Free',
    description: 'Welcome to ZivoxTV. Watch the latest blockbuster movies and hit TV series. Find the best streaming destination for trending entertainment right here.',
    url: 'https://zivoxtv.live/',
    siteName: 'ZivoxTV',
    images: [{ url: 'https://zivoxtv.live/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZivoxTV | Watch Top Trending Movies & TV Shows Free',
    description: 'Welcome to ZivoxTV. Watch the latest blockbuster movies and hit TV series.',
    images: ['https://zivoxtv.live/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} antialiased selection:bg-zivox-violet/30 selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
