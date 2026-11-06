'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { WebStudioPricingModal } from '../components/WebStudioPricingModal';
import { AccountSettingsModal } from '../components/AccountSettingsModal';
import { OrganizationManagementModal } from '../components/OrganizationManagementModal';
import { getOrganizationEntitlements } from '../lib/api';
import { Entitlement, Organization } from '../types/auth';
import { 
  Building2, 
  ChevronDown, 
  Layers, 
  LogIn, 
  LogOut, 
  Palette, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  KeyRound,
  Lock,
  Settings,
  UserPlus,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function WorkspacePage() {
  const { user, isAuthenticated, isLoading, login, logout, refreshSession, updateUser } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('default');
  const [orgEntitlements, setOrgEntitlements] = useState<Entitlement[]>([]);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Modals state
  const [isWebStudioPricingOpen, setIsWebStudioPricingOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isOrgManagementOpen, setIsOrgManagementOpen] = useState(false);

  // Tab State for Main View
  const [currentTab, setCurrentTab] = useState<'launcher' | 'org_overview'>('launcher');

  // Check if current user is superadmin (case-insensitive)
  const isSuperadmin = user?.roles?.some((r) => r.toLowerCase() === 'superadmin') || false;

  // Active Organization resolution
  const activeOrg: Organization | null = 
    user?.organizations?.find((o) => o.id === selectedOrgId) ||
    user?.organizations?.[0] ||
    null;

  // Initialize selectedOrgId when user is loaded
  useEffect(() => {
    if (user?.organizations && user.organizations.length > 0 && selectedOrgId === 'default') {
      setSelectedOrgId(user.organizations[0].id);
    }
  }, [user, selectedOrgId]);

  // Fetch entitlements whenever active organization changes
  useEffect(() => {
    async function loadOrgEntitlements() {
      if (!activeOrg?.id) return;
      try {
        const ents = await getOrganizationEntitlements(activeOrg.id);
        setOrgEntitlements(ents);
      } catch (err) {
        console.warn('Gagal memuat entitlements organisasi:', err);
      }
    }
    if (isAuthenticated && activeOrg?.id) {
      loadOrgEntitlements();
    }
  }, [activeOrg?.id, isAuthenticated]);

  // Combined entitlements (user-level + active org-level)
  const allEntitlements: Entitlement[] = [
    ...(user?.entitlements || []),
    ...orgEntitlements,
  ];

  // Entitlement status helper
  const getProductEntitlement = (appCode: string): Entitlement | undefined => {
    return allEntitlements.find(
      (e) => e.app_code.toUpperCase() === appCode.toUpperCase()
    );
  };

  const crmEntitlement = getProductEntitlement('NEXAMOS_CRM');
  const isCrmActive = !!crmEntitlement && crmEntitlement.status === 'active';

  const webStudioEntitlement = getProductEntitlement('NEXAMOS_WEB_STUDIO');
  const isWebStudioActive = !webStudioEntitlement || webStudioEntitlement.status === 'active';

  // Role resolution for active organization
  const currentUserOrgRole = activeOrg?.role_name || activeOrg?.role_code || (isSuperadmin ? 'Superadmin' : 'Member');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
        {/* Brand & Workspace Label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base">NexaMOS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  Workspace
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-5 w-px bg-slate-800 mx-2" />

          {/* Organization Switcher Dropdown */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium truncate max-w-36">
                  {activeOrg ? activeOrg.name : 'Personal Workspace'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {isOrgDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-40">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                    <span>Organisasi Anda</span>
                    <span className="text-indigo-400 text-xs font-normal">Ganti Konteks</span>
                  </div>
                  {user?.organizations && user.organizations.length > 0 ? (
                    <div className="space-y-1">
                      {user.organizations.map((org) => {
                        const isSelected = org.id === activeOrg?.id;
                        return (
                          <button
                            key={org.id}
                            onClick={() => {
                              setSelectedOrgId(org.id);
                              setIsOrgDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                              isSelected
                                ? 'bg-indigo-600/10 text-indigo-300 font-semibold border border-indigo-500/20'
                                : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div>{org.name}</div>
                              <div className="text-slate-500 text-xs">{org.organization_type}</div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400">
                      Belum tergabung di organisasi B2B. Beroperasi dalam mode Personal Workspace.
                    </div>
                  )}

                  {activeOrg && (
                    <div className="pt-2 mt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsOrgDropdownOpen(false);
                          setIsOrgManagementOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-indigo-400 hover:bg-indigo-500/10 transition text-left font-medium"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Kelola Organisasi Ini</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Auth / Profile */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-8 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ) : !isAuthenticated ? (
            <button
              onClick={() => login()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-600/20 hover:brightness-110 transition active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk NexaMOS</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-xs text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow">
                  {user?.display_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block">
                  <div className="text-white font-medium truncate max-w-32">
                    {user?.display_name}
                  </div>
                  <div className="text-indigo-400 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Nexa ID SSO</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-40">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-2">
                    <div className="font-semibold text-white text-xs truncate">
                      {user?.display_name}
                    </div>
                    <div className="text-slate-400 text-xs truncate mt-0.5">
                      {user?.email || 'Akun NexaMOS Terhubung'}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                        Status: Aktif
                      </span>
                      {isSuperadmin && (
                        <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
                          Superadmin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 border-b border-slate-800/80 pb-2 mb-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAccountSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Pengaturan Akun & Profil</span>
                    </button>

                    {activeOrg && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsOrgManagementOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition text-left"
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Kelola Organisasi ({activeOrg.name})</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>Keluar Akun (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content Body ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8">
        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl bg-linear-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Marketing Operating System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              {isAuthenticated
                ? `Selamat datang kembali, ${user?.display_name}!`
                : 'Pusat Kendali Ekosistem NexaMOS'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Akses seluruh aplikasi ekosistem pemasaran berbasis bukti NexaMOS dalam satu sesi
              Single Sign-On terpadu. Buka CRM, buat landing page di Web Studio, atau kelola organisasi tanpa perlu login berulang kali.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={() => login()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-600/30 hover:brightness-110 transition active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk dengan Nexa ID SSO</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsAccountSettingsOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 transition"
                  >
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Pengaturan Akun</span>
                  </button>

                  {activeOrg && (
                    <button
                      onClick={() => setIsOrgManagementOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-600/20 transition"
                    >
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>Kelola Tim {activeOrg.name}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Product Launcher Grid ───────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Aplikasi & Produk Resmi</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Status entitlement aktif disinkronkan dengan lisensi organisasi{' '}
                <span className="text-white font-medium">{activeOrg ? activeOrg.name : 'Personal'}</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. NexaMOS Web Studio */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 p-6 flex flex-col justify-between transition group shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20 group-hover:scale-105 transition">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Desain Aktif</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                      Publikasi Berbayar
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1">
                  NexaMOS Web Studio
                </h3>
                <p className="text-xs text-indigo-400 font-medium mb-3">
                  Visual Landing Page & Funnel Builder
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Rancang landing page berkonversi tinggi dengan kanvas responsif, mode pratinjau live, dan formulir leads yang langsung terhubung ke CRM NexaMOS.
                </p>

                {/* Ringkasan Layanan Publikasi */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Editor Visual:</span>
                    <span className="text-emerald-400 font-semibold">Gratis & Siap Pakai</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Layanan Publikasi:</span>
                    <span className="text-amber-300 font-semibold">Mulai Rp 99.000 / bln</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Domain .COM:</span>
                    <span className="text-violet-300 font-semibold">Terima Beres Rp 300rb / thn</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Live Builder
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Cloudflare Edge
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Auto CRM Leads
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://studio.nexamos.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
                >
                  <span>Buka Web Studio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsWebStudioPricingOpen(true)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
                  title="Lihat Rincian Paket Publikasi Web Studio"
                >
                  <span>Paket Publikasi</span>
                </button>
              </div>
            </div>

            {/* 2. NexaMOS CRM */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 p-6 flex flex-col justify-between transition group shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  {isCrmActive ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Closed Beta Pilot</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1">
                  NexaMOS CRM
                </h3>
                <p className="text-xs text-indigo-400 font-medium mb-3">
                  Evidence-Based Closed-Loop Marketing
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Kelola siklus 8 status kanonikal calon pelanggan, integrasi Meta Cloud API WhatsApp, atribusi multi-kanal, dan otomasi bukti konversi.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    8 Canonical Lifecycle
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Smart WhatsApp
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    B2B & B2C
                  </span>
                </div>
              </div>

              <a
                href="https://crm.nexamos.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                <span>Buka NexaMOS CRM</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* 3. NexaMOS Admin / Super Admin */}
            <div className={`rounded-2xl bg-slate-900/80 border p-6 flex flex-col justify-between transition group shadow-lg ${
              isSuperadmin
                ? 'border-slate-800 hover:border-violet-500/40'
                : 'border-slate-800/40 opacity-75'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-violet-600 to-purple-800 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  {isSuperadmin ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold">
                      Akses Superadmin
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
                      Perlu Hak Akses
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition mb-1">
                  NexaMOS Superadmin
                </h3>
                <p className="text-xs text-violet-400 font-medium mb-3">
                  Tenant Provisioning & Database Routing
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Panel kontrol operasi multi-tenant, manajemen skema database, approval WABA WhatsApp, dan monitoring kuota closed beta.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Tenant Control
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    WABA Onboarding
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Audit Log
                  </span>
                </div>
              </div>

              {isSuperadmin ? (
                <a
                  href="https://superadmin.nexamos.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition active:scale-95"
                >
                  <span>Buka Superadmin Panel</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/60 text-slate-500 text-xs font-medium cursor-not-allowed"
                >
                  <span>Akses Terbatas Superadmin</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Organization & Security Status ───────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Organization Information Card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">Konteks Organisasi</h3>
                </div>
                {activeOrg && (
                  <button
                    onClick={() => setIsOrgManagementOpen(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition font-medium flex items-center gap-1"
                  >
                    <span>Kelola Tim</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Seluruh data CRM, kontak pelanggan, dan aset web Anda terisolasi secara aman dalam namespace organisasi.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Organisasi Terpilih</span>
                  <span className="text-xs font-semibold text-white">
                    {activeOrg ? activeOrg.name : 'Personal Workspace'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Peran Akun Anda</span>
                  <span className="text-xs font-semibold text-indigo-400">
                    {currentUserOrgRole}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Status Langganan</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    Closed Beta (Akses Penuh)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Layanan Web Studio</span>
                  <span className="text-xs font-semibold text-indigo-300">
                    Desain Bebas • Publikasi Berbayar
                  </span>
                </div>
              </div>
            </div>

            {activeOrg && (
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Slug: {activeOrg.slug}</span>
                <button
                  onClick={() => setIsOrgManagementOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/20 transition"
                >
                  Buka Panel Organisasi
                </button>
              </div>
            )}
          </div>

          {/* Security & SSO Architecture Card */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Arsitektur Identitas Terpusat</h3>
                </div>
                <button
                  onClick={() => setIsAccountSettingsOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition font-medium flex items-center gap-1"
                >
                  <span>Detail Sesi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Autentikasi diverifikasi langsung oleh Keycloak 24 OIDC Engine dengan enkripsi RS256 token signature dan PKCE code protection.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Penyedia Identitas (IdP)</span>
                  <span className="text-xs font-semibold text-white">Keycloak 24 (Quarkus)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Protokol Keamanan</span>
                  <span className="text-xs font-semibold text-indigo-400">OAuth 2.0 + OIDC PKCE</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400">Database Entitlement</span>
                  <span className="text-xs font-semibold text-emerald-400">MySQL Hostinger (11 Tabel IAM)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">SSO Session: Terproteksi</span>
              <button
                onClick={() => setIsAccountSettingsOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition"
              >
                Pengaturan Profil
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      {/* 1. Web Studio Pricing Modal */}
      <WebStudioPricingModal
        isOpen={isWebStudioPricingOpen}
        onClose={() => setIsWebStudioPricingOpen(false)}
        userName={user?.display_name || undefined}
        userEmail={user?.email || undefined}
        organizationName={activeOrg ? activeOrg.name : 'Personal Workspace'}
      />

      {/* 2. Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        user={user}
        onProfileUpdated={(newName) => {
          updateUser({ display_name: newName });
        }}
        onLogoutAll={() => {
          logout();
        }}
      />

      {/* 3. Organization Management Modal */}
      <OrganizationManagementModal
        isOpen={isOrgManagementOpen}
        onClose={() => setIsOrgManagementOpen(false)}
        organization={activeOrg}
        currentUserRole={currentUserOrgRole}
        onOrganizationUpdated={(newName) => {
          refreshSession();
        }}
      />

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400">
        <p>© 2026 NexaMOS (PT. Derma Indonesia Academy). Platform Sistem Operasi Pemasaran Berbasis Bukti.</p>
        <p className="mt-1 text-slate-400">Pusat Kendali Resmi: nexamos.cloud/workspace • Single Sign-On ID Platform</p>
      </footer>
    </div>
  );
}
