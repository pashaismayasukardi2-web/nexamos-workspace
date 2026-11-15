import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/workspace';

export const metadata: Metadata = {
  title: 'NexaMOS Workspace — Pusat Kendali Aplikasi Pemasaran',
  description: 'Akses seluruh aplikasi NexaMOS (CRM, Web Studio, Super Admin) dalam satu pintu Single Sign-On terpadu.',
  icons: {
    icon: [
      { url: `${basePath}/icon.png?v=4`, type: 'image/png', sizes: '512x512' },
      { url: `${basePath}/favicon-32x32.png?v=4`, type: 'image/png', sizes: '32x32' },
      { url: `${basePath}/favicon-16x16.png?v=4`, type: 'image/png', sizes: '16x16' },
      { url: `${basePath}/favicon.svg?v=4`, type: 'image/svg+xml' },
      { url: `${basePath}/favicon.ico?v=4`, sizes: 'any' },
    ],
    apple: [
      { url: `${basePath}/apple-touch-icon.png?v=4`, sizes: '180x180', type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.ico?v=4`,
  },
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

