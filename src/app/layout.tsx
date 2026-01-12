import type { Metadata } from "next";
import { Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const devanagari = Noto_Serif_Devanagari({ 
  subsets: ["devanagari"], 
  weight: ['400', '700'],
  variable: '--font-devanagari'
});

export const metadata: Metadata = {
  title: "QubitGyan Admin",
  description: "The Ultimate Knowledge Tree Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${devanagari.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}