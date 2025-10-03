import './globals.css';
import type { Metadata } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import { ServiceWorkerManager } from '@/components/ServiceWorkerManager';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'EduGlow - AI-Powered Learning Platform',
  description: 'Master your subjects with personalized AI-powered quizzes and feedback',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${poppins.variable} ${ptSans.variable}`}>
        {children}
        <ServiceWorkerManager />
      </body>
    </html>
  );
}
