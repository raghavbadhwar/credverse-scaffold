import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'CredVerse - Protocol-Grade Credential Infrastructure',
  description: 'India\'s first protocol-grade credential infrastructure for universities, students, and recruiters. W3C compliant, blockchain-anchored, and privacy-preserving.',
  keywords: 'credentials, blockchain, education, verifiable-credentials, india, polygon, w3c, did',
  authors: [{ name: 'CredVerse Team' }],
  openGraph: {
    title: 'CredVerse - Protocol-Grade Credential Infrastructure',
    description: 'India\'s first protocol-grade credential infrastructure for universities, students, and recruiters.',
    url: 'https://credverse.in',
    siteName: 'CredVerse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CredVerse - Protocol-Grade Credential Infrastructure',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CredVerse - Protocol-Grade Credential Infrastructure',
    description: 'India\'s first protocol-grade credential infrastructure for universities, students, and recruiters.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
