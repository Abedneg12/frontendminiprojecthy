import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import StoreProvider from "@/components/storeProvider";
import { Toaster} from 'react-hot-toast'
import AuthInitializer from '@/components/AuthInitializer';
import Navbar from "@/components/Navbar";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindYourTicket.com",
  description: "Where all your ticket resides",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${montserrat.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <AuthInitializer>
            <Navbar/>
          <div>
          <Toaster position = "top-right" />
          {children}
          </div>
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}
