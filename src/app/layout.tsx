import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Sky · GCC Pilot Training Academic Operations',
  description: 'Academic and Flight Training Operations Dashboard for Glendale Community College - Associate of Science in Pilot Training',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#f7f8f3] text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
