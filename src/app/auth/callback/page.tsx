'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleCallback } from '../../../lib/auth';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setErrorMessage(errorDescription || error || 'Autentikasi dibatalkan.');
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMessage('Parameter autentikasi tidak lengkap (missing code or state).');
      return;
    }

    async function processAuth() {
      try {
        await handleCallback(code!, state!);
        setStatus('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      } catch (err: any) {
        console.error('[Auth Callback Error]', err);
        setStatus('error');
        setErrorMessage(err.message || 'Gagal memproses sesi login.');
      }
    }

    processAuth();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
            N
          </div>
          <div className="text-left">
            <div className="font-bold text-white text-lg tracking-tight">NexaMOS</div>
            <div className="text-xs text-indigo-400 font-medium">Workspace Single Sign-On</div>
          </div>
        </div>

        {/* State: Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <div>
              <h2 className="text-white font-semibold text-base mb-1">
                Menghubungkan Akun NexaMOS...
              </h2>
              <p className="text-slate-400 text-xs">
                Sedang memverifikasi hak akses Workspace Anda.
              </p>
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-white font-semibold text-base mb-1">
                Autentikasi Berhasil!
              </h2>
              <p className="text-emerald-400/90 text-xs">
                Mengarahkan ke dashboard Workspace...
              </p>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base mb-1">
                Gagal Masuk
              </h2>
              <p className="text-rose-400 text-xs wrap-break-word">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
                N
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg tracking-tight">NexaMOS</div>
                <div className="text-xs text-indigo-400 font-medium">Workspace Single Sign-On</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <div>
                <h2 className="text-white font-semibold text-base mb-1">
                  Menghubungkan Akun NexaMOS...
                </h2>
                <p className="text-slate-400 text-xs">
                  Sedang menyiapkan autentikasi...
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

