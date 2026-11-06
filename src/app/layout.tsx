import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'NexaMOS Workspace — Pusat Kendali Aplikasi Pemasaran',
  description: 'Akses seluruh aplikasi NexaMOS (CRM, Web Studio, Super Admin) dalam satu pintu Single Sign-On terpadu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

