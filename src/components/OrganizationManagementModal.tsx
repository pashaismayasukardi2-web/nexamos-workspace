'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Layers, 
  MoreVertical, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Edit2,
  Save,
  UserX
} from 'lucide-react';
import { Organization, OrgMember, Entitlement } from '../types/auth';
import { 
  getOrganizationMembers, 
  addOrganizationMember, 
  updateOrganizationMember, 
  removeOrganizationMember,
  updateOrganizationName,
  getOrganizationEntitlements
} from '../lib/api';

interface OrganizationManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization | null;
  currentUserRole?: string;
  onOrganizationUpdated?: (newName: string) => void;
}

export function OrganizationManagementModal({
  isOpen,
  onClose,
  organization,
  currentUserRole,
  onOrganizationUpdated,
}: OrganizationManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'details' | 'entitlements'>('members');
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Invite member form state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ORG_ADMIN' | 'ORG_MEMBER'>('ORG_MEMBER');
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Edit organization name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const canManage = currentUserRole === 'ORG_OWNER' || currentUserRole === 'ORG_ADMIN' || currentUserRole?.toLowerCase() === 'superadmin';

  useEffect(() => {
    if (organization?.name) {
      setOrgName(organization.name);
    }
  }, [organization]);

  useEffect(() => {
    if (isOpen && organization?.id) {
      loadMembers();
      loadEntitlements();
    }
  }, [isOpen, organization?.id]);

  const loadMembers = async () => {
    if (!organization?.id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getOrganizationMembers(organization.id);
      setMembers(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat daftar member.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntitlements = async () => {
    if (!organization?.id) return;
    try {
      const ents = await getOrganizationEntitlements(organization.id);
      setEntitlements(ents);
    } catch (err) {
      console.warn('Gagal memuat entitlements org:', err);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id || !inviteEmail.trim()) return;

    setIsSubmittingInvite(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await addOrganizationMember(organization.id, inviteEmail.trim(), inviteRole);
      setSuccessMessage(`Undangan berhasil dikirim ke ${inviteEmail}!`);
      setInviteEmail('');
      setIsInviteOpen(false);
      await loadMembers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengundang member.');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!organization?.id) return;
    try {
      await updateOrganizationMember(organization.id, userId, { role_code: newRole });
      setSuccessMessage('Peran member berhasil diperbarui.');
      await loadMembers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui peran member.');
    }
  };

  const handleToggleMemberStatus = async (userId: string, currentStatus: string) => {
    if (!organization?.id) return;
    const targetStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateOrganizationMember(organization.id, userId, { status: targetStatus });
      setSuccessMessage(`Status member diubah menjadi ${targetStatus}.`);
      await loadMembers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengubah status member.');
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!organization?.id) return;
    if (!window.confirm(`Yakin ingin mengeluarkan ${memberName} dari organisasi ini?`)) {
      return;
    }
    try {
      await removeOrganizationMember(organization.id, userId);
      setSuccessMessage(`${memberName} berhasil dikeluarkan.`);
      await loadMembers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengeluarkan member.');
    }
  };

  const handleSaveName = async () => {
    if (!organization?.id || !orgName.trim()) return;
    setIsSavingName(true);
    try {
      await updateOrganizationName(organization.id, orgName.trim());
      setIsEditingName(false);
      setSuccessMessage('Nama organisasi berhasil diperbarui.');
      if (onOrganizationUpdated) {
        onOrganizationUpdated(orgName.trim());
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui nama organisasi.');
    } finally {
      setIsSavingName(false);
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{organization.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/20">
                  {organization.organization_type}
                </span>
              </div>
              <p className="text-xs text-slate-400">ID Organisasi: {organization.slug}</p>
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
            onClick={() => setActiveTab('members')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'members'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Anggota & Peran ({members.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('entitlements')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'entitlements'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hak Akses Produk ({entitlements.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Detail Organisasi</span>
          </button>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
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
          {activeTab === 'members' && (
            <div className="space-y-4">
              {/* Header & Invite Trigger */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Daftar Anggota Organisasi</h3>
                  <p className="text-xs text-slate-400">
                    Kelola peran dan izin akses anggota ke seluruh aplikasi NexaMOS.
                  </p>
                </div>
                {canManage && (
                  <button
                    onClick={() => setIsInviteOpen(!isInviteOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Undang Member</span>
                  </button>
                )}
              </div>

              {/* Form Undang Member (Collapsible) */}
              {isInviteOpen && (
                <form
                  onSubmit={handleInviteSubmit}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 animate-in fade-in duration-200"
                >
                  <div className="font-semibold text-xs text-white flex items-center gap-2">
                    <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Undang Member Baru</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Masukkan alamat email member"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-xs"
                      >
                        <option value="ORG_MEMBER">Member Biasa</option>
                        <option value="ORG_ADMIN">Admin Organisasi</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsInviteOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingInvite}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingInvite ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <span>Kirim Undangan</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Members List Table / Cards */}
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                  <span>Memuat anggota organisasi...</span>
                </div>
              ) : members.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-950/40 border border-slate-800">
                  Belum ada anggota terdaftar.
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((mbr) => (
                    <div
                      key={mbr.membership_id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow shrink-0">
                          {mbr.display_name?.charAt(0).toUpperCase() || 'M'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{mbr.display_name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                              mbr.role_code === 'ORG_OWNER'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : mbr.role_code === 'ORG_ADMIN'
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {mbr.role_code === 'ORG_OWNER' ? 'Owner' : mbr.role_code === 'ORG_ADMIN' ? 'Admin' : 'Member'}
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">{mbr.email || 'Akun Internal'}</div>
                        </div>
                      </div>

                      {/* Member Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {canManage && mbr.role_code !== 'ORG_OWNER' ? (
                          <>
                            <select
                              value={mbr.role_code || 'ORG_MEMBER'}
                              onChange={(e) => handleChangeRole(mbr.user_id, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="ORG_MEMBER">Member</option>
                              <option value="ORG_ADMIN">Admin</option>
                            </select>

                            <button
                              onClick={() => handleToggleMemberStatus(mbr.user_id, mbr.membership_status)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium border transition ${
                                mbr.membership_status === 'active'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                              title={mbr.membership_status === 'active' ? 'Tangguhkan Akses' : 'Aktifkan Kembali'}
                            >
                              {mbr.membership_status === 'active' ? 'Tangguhkan' : 'Aktifkan'}
                            </button>

                            <button
                              onClick={() => handleRemoveMember(mbr.user_id, mbr.display_name)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                              title="Hapus Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {mbr.membership_status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'entitlements' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Lisensi & Entitlement Produk</h3>
                <p className="text-xs text-slate-400">
                  Daftar produk yang telah terlisensi untuk organisasi ini di NexaMOS Identity Engine.
                </p>
              </div>

              {entitlements.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-950/40 border border-slate-800">
                  Belum ada entitlement terpisah untuk organisasi ini. Menggunakan lisensi default Closed Beta.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entitlements.map((ent) => (
                    <div
                      key={ent.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">{ent.app_name}</div>
                        <div className="text-indigo-400 font-mono text-xs mt-0.5">{ent.domain}</div>
                        <div className="text-slate-400 text-xs mt-2">
                          Paket: <span className="text-white font-medium">{ent.plan_code || 'Standard Beta'}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        ent.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {ent.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-400">Nama Organisasi</div>
                  {canManage && !isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Ubah Nama</span>
                    </button>
                  )}
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50"
                    >
                      {isSavingName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Simpan</span>
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs transition"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="text-base font-bold text-white">{organization.name}</div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Slug Identitas:</span>
                    <span className="font-mono text-slate-300">{organization.slug}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Tipe Organisasi:</span>
                    <span className="text-slate-300">{organization.organization_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Status:</span>
                    <span className="text-emerald-400 font-semibold">{organization.status.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Peran Anda:</span>
                    <span className="text-indigo-400 font-semibold">{currentUserRole || 'Member'}</span>
                  </div>
                </div>
              </div>
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

