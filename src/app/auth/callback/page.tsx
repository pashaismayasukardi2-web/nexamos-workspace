'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBasePath, handleCallback, login } from '../../../lib/auth';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const RETRY_FLAG_KEY = 'nexamos_workspace_sso_retry';

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
      sessionStorage.removeItem(RETRY_FLAG_KEY);
      setStatus('error');
      setErrorMessage(errorDescription || error || 'Autentikasi dibatalkan.');
      return;
    }

    if (!code || !state) {
      if (sessionStorage.getItem(RETRY_FLAG_KEY) !== '1') {
        sessionStorage.setItem(RETRY_FLAG_KEY, '1');
        login();
        return;
      }
      sessionStorage.removeItem(RETRY_FLAG_KEY);
      setStatus('error');
      setErrorMessage('Parameter autentikasi tidak lengkap (missing code or state).');
      return;
    }

    async function processAuth() {
      try {
        await handleCallback(code!, state!);
        sessionStorage.removeItem(RETRY_FLAG_KEY);
        setStatus('success');
        setTimeout(() => {
          window.location.href = getBasePath() || '/';
        }, 600);
      } catch (err: any) {
        console.warn('[Auth Callback] Retrying or handling error:', err);
        const msg = String(err?.message || '');
        const isRecoverablePkceState =
          err?.code === 'STATE_MISMATCH' ||
          err?.code === 'VERIFIER_MISSING' ||
          msg.includes('State validation failed') ||
          msg.includes('Code verifier') ||
          msg.includes('invalid_grant') ||
          msg.includes('Code not valid');

        if (isRecoverablePkceState && sessionStorage.getItem(RETRY_FLAG_KEY) !== '1') {
          sessionStorage.setItem(RETRY_FLAG_KEY, '1');
          await login();
          return;
        }

        sessionStorage.removeItem(RETRY_FLAG_KEY);
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
        <div className="flex flex-col items-center justify-center gap-1 mb-6">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || '/workspace'}/logo-nexa-01.png`}
            alt="NexaMOS"
            className="h-11 w-auto object-contain"
          />
          <div className="text-xs text-indigo-400 font-medium">Workspace Single Sign-On</div>
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
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => login()}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
              >
                Coba Masuk Lagi
              </button>
              <button
                onClick={() => {
                  window.location.href = getBasePath() || '/';
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Kembali ke Workspace
              </button>
            </div>
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
            <div className="flex flex-col items-center justify-center gap-1 mb-6">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || '/workspace'}/logo-nexa-01.png`}
                alt="NexaMOS"
                className="h-11 w-auto object-contain"
              />
              <div className="text-xs text-indigo-400 font-medium">Workspace Single Sign-On</div>
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

