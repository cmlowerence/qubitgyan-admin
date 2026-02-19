import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { CurrentUserProvider } from '@/context/current-user-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'QubitGyan Admin',
  description: 'Admin Panel',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <CurrentUserProvider>{children}</CurrentUserProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
