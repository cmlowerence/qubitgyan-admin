import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Font
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// 2. Initialize Font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QubitGyan Admin",
  description: "Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. Apply the font class to the body */}
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
