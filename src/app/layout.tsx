
import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { ItineraryProvider } from '@/context/itinerary-context';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AuthGuard } from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'TripWise',
  description: 'A travel itinerary planner website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ItineraryProvider>
              <AuthGuard>
                <AppShell>{children}</AppShell>
              </AuthGuard>
            </ItineraryProvider>
          </ThemeProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
