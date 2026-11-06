'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Rocket,
  Globe,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  Lock,
  Zap,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface WebStudioPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  organizationName?: string;
}

export const WebStudioPricingModal: React.FC<WebStudioPricingModalProps> = ({
  isOpen,
  onClose,
  userName = 'Pengguna NexaMOS',
  userEmail = '',
  organizationName = 'Personal Workspace',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const cloudPriceText = billingCycle === 'yearly' ? 'Rp 990.000 / tahun (Diskon 2 Bulan)' : 'Rp 99.000 / bulan';
  const waCloudOrderText = `Halo Tim NexaMOS, saya ingin berlangganan *Paket Publikasi Subdomain NexaMOS Web Studio* (${cloudPriceText}) untuk organisasi *${organizationName}*.\n\nAkun: *${userName}* (${userEmail || 'Nexa ID SSO'})\n\nMohon dibantu proses aktivasi publikasi landing page lembaga kami. Terima kasih!`;
  const waCloudOrderUrl = `https://wa.me/6285659024775?text=${encodeURIComponent(waCloudOrderText)}`;

  const waDomainOrderText = `Halo Tim NexaMOS, saya ingin memesan *Layanan Domain .COM Terima Beres* (Rp 300.000/thn) untuk landing page organisasi *${organizationName}*.\n\nAkun: *${userName}* (${userEmail || 'Nexa ID SSO'})\n\nMohon dibantu proses pendaftaran domain resmi .COM dan setup DNS SSL sampai tayang. Terima kasih!`;
  const waDomainOrderUrl = `https://wa.me/6285659024775?text=${encodeURIComponent(waDomainOrderText)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-screen overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20 shrink-0">
              <Rocket className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Layanan Publikasi NexaMOS Web Studio
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                  Layanan Berbayar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Desain kanvas bebas diakses. Aktifkan publikasi untuk menayangkan landing page lembaga Anda ke internet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Ekosistem Pemasaran Terintegrasi:</strong> Landing page yang dipublikasikan melalui Web Studio langsung otomatis terhubung ke database <strong className="text-white">NexaMOS CRM</strong> dan WhatsApp CS Anda, lengkap dengan penangkap parameter iklan (UTM) dan kepatuhan UU PDP No. 27/2022.
            </div>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl max-w-xs mx-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Tahunan</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                -2 Bulan
              </span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Plan 1: Subdomain NexaMOS Cloud */}
            <div className="rounded-2xl bg-slate-950 border-2 border-indigo-500/40 p-5 flex flex-col justify-between shadow-xl relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow">
                Paket Utama
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Paket Publikasi Cloud</h4>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-black text-white">
                    {billingCycle === 'yearly' ? 'Rp 990.000' : 'Rp 99.000'}
                    <span className="text-xs font-normal text-slate-400">
                      {billingCycle === 'yearly' ? ' / tahun' : ' / bulan'}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-400 font-mono mt-1">
                    studio.nexamos.cloud/p/[nama-lembaga]
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Hosting Global Cloudflare Edge (100% Uptime)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sertifikat SSL HTTPS Resmi Otomatis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited Leads Form Sync Real-Time ke CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pelacakan Meta CAPI Pixel & Google Ads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Klausul Persetujuan Privasi UU PDP No. 27/2022</span>
                  </li>
                </ul>
              </div>

              <a
                href={waCloudOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Paket Cloud via WhatsApp</span>
              </a>
            </div>

            {/* Plan 2: Domain .COM Terima Beres */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-violet-500/40 p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <h4 className="text-sm font-bold text-white">Domain .COM Terima Beres</h4>
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-black text-white">
                    Rp 300.000
                    <span className="text-xs font-normal text-slate-400"> / tahun</span>
                  </div>
                  <div className="text-xs text-violet-400 font-mono mt-1">
                    [namalembagakamu].com
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pendaftaran Domain Resmi .COM (Milik Lembaga)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Setup DNS & SSL 100% oleh Tim Teknis NexaMOS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Garansi Tayang Kilat Dalam 1 Jam Kerja</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Termasuk Seluruh Fitur Paket Publikasi Cloud</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Siap Digunakan Untuk Pasang Iklan Berbayar</span>
                  </li>
                </ul>
              </div>

              <a
                href={waDomainOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan Domain .COM via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Launcher Redirect */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Ingin mulai merancang kanvas dulu secara gratis?</span>
            <a
              href="https://studio.nexamos.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <span>Buka Visual Editor Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

