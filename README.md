# 🖥️ NexaMOS Unified Workspace

Pusat kendali ekosistem terpadu platform **NexaMOS** (Marketing Operating System). Memungkinkan pengguna dan organisasi untuk mengelola seluruh aplikasi pemasaran berbasis bukti dalam satu sesi Single Sign-On (SSO).

## 🚀 Fitur Utama
- **Unified Product Launcher**: Akses terpadu ke NexaMOS Web Studio, NexaMOS CRM, dan NexaMOS Superadmin sesuai status entitlement akun.
- **Organization Switcher & Context**: Beralih antar-organisasi dengan refresh otomatis hak akses produk dan peran anggota.
- **Account Settings & Security**: Pengaturan profil display name, riwayat sesi/aktivitas dari `iam_audit_events`, dan pencabutan sesi global.
- **Organization Management**: Manajemen detail organisasi, penugasan peran member (`ORG_OWNER`, `ORG_ADMIN`, `ORG_MEMBER`), serta undangan anggota baru.

## 🛠️ Stack Teknologi
- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Identity Provider**: Keycloak 24 OIDC Engine (OAuth 2.0 PKCE S256)
- **Backend API**: NexaMOS Identity API (Express.js + MySQL Hostinger IAM)

## 📦 Menjalankan Secara Lokal
```bash
npm install
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3001`.
