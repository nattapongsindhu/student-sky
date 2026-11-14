import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Sky · GCC Aviation & Pilot Training Operations',
  description: 'Academic and Flight Training Operations Dashboard for Glendale Community College - Associate of Science in Aviation and Transportation - Pilot Training',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FBFBFA] text-[#1E293B]">
        {children}
      </body>
    </html>
  );
}
