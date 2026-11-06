'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Clock,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Laptop,
  History,
  Save,
  Loader2
} from 'lucide-react';
import { IAMUser, AuditEvent } from '../types/auth';
import { updateProfile, getMyAuditEvents, revokeAllSessions } from '../lib/api';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IAMUser | null;
  onProfileUpdated?: (newName: string) => void;
  onLogoutAll?: () => void;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
  onLogoutAll,
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'history'>('profile');
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);

  useEffect(() => {
    if (user?.display_name) {
      setDisplayName(user.display_name);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && activeTab === 'history') {
      loadAuditEvents();
    }
  }, [isOpen, activeTab]);

  const loadAuditEvents = async () => {
    setIsLoadingEvents(true);
    setErrorMessage(null);
    try {
      const events = await getMyAuditEvents();
      setAuditEvents(events);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat log aktivitas.');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    try {
      await updateProfile(displayName.trim());
      setSaveSuccess('Profil Anda berhasil diperbarui!');
      if (onProfileUpdated) {
        onProfileUpdated(displayName.trim());
      }
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeSessions = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar dari semua sesi di perangkat lain? Anda akan diminta login ulang.')) {
      return;
    }

    setIsRevokingSessions(true);
    setErrorMessage(null);
    try {
      await revokeAllSessions();
      if (onLogoutAll) {
        onLogoutAll();
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mencabut sesi.');
      setIsRevokingSessions(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Pengaturan Akun & Profil</h2>
              <p className="text-xs text-slate-400">NexaMOS Central Identity & Single Sign-On</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil Pengguna</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${activeTab === 'security'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sesi & Keamanan</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${activeTab === 'history'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Aktivitas</span>
          </button>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Nama Tampilan (Display Name)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Masukkan nama tampilan Anda"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-xs sm:text-sm transition"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Nama ini akan terlihat di seluruh aplikasi NexaMOS (CRM, Web Studio, dan Workspace).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Alamat Email Resmi
                </label>
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300">
                  <span className="font-mono">{user?.email || 'Tidak terhubung email'}</span>
                  {user?.email_verified ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      Belum Verifikasi
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Email dikelola terpusat oleh Keycloak Identity Provider untuk keamanan login.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Status Keamanan Single Sign-On (SSO)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Mekanisme Autentikasi:</span>
                    <span className="font-semibold text-white">OAuth 2.0 PKCE (S256)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Penyedia Identitas:</span>
                    <span className="font-semibold text-white">Keycloak 24 (Quarkus)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                  <Laptop className="w-4 h-4 text-indigo-400" />
                  <span>Sesi Perangkat Aktif</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jika Anda mencurigai adanya akses dari perangkat yang tidak dikenal, Anda dapat mencabut seluruh sesi login. Anda akan diminta login kembali di seluruh browser.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleRevokeSessions}
                    disabled={isRevokingSessions}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRevokingSessions ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mencabut Sesi...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Logout dari Semua Perangkat (Revoke Sessions)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium text-slate-400">
                  Aktivitas Akun Terbaru (Audit Log)
                </div>
                <button
                  onClick={loadAuditEvents}
                  disabled={isLoadingEvents}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Segarkan
                </button>
              </div>

              {isLoadingEvents ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                  <span>Memuat riwayat aktivitas...</span>
                </div>
              ) : auditEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-950/40 border border-slate-800">
                  Belum ada log aktivitas yang tercatat untuk akun ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white tracking-wide">
                          {evt.event_type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {evt.ip_address ? `IP: ${evt.ip_address}` : 'Sistem Internal'}
                          {evt.target_type && ` • Target: ${evt.target_type}`}
                        </div>
                      </div>
                      <div className="text-slate-500 text-xs whitespace-nowrap shrink-0">
                        {new Date(evt.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

