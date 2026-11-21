# Panduan Deploy Frontend MY HOMS (Akun Uji) ke GitHub Pages

Paket ini berisi frontend MY HOMS yang terpisah dari Google Apps Script (arsitektur
gas-pro-api): `index.html`, `css/style.css`, `js/app.js`, `js/config.js`, plus PWA
(`manifest.json`, `sw.js`, ikon). Backend-nya adalah proyek Apps Script MY_HOMS_UJI
yang Anda pasang dari paket `MY_HOMS_UJI_v1.38.0_fullstack.zip`.

## 1. Isi URL backend
Buka `js/config.js`, ganti:
```js
window.MYHOMS_API = 'GANTI_DENGAN_URL_WEBAPP_EXEC';
```
dengan URL `/exec` hasil Deploy dari proyek Apps Script Anda (Langkah A.8 di
README_PASANG.txt paket backend). URL ini aman ditaruh di sini — bukan rahasia;
keamanan dijaga oleh token sesi dan pengecekan peran di server.

## 2. Siapkan Git & repo GitHub (sekali saja)
```bash
git --version          # pastikan Git terpasang
git config --global user.name  "Nama Anda"
git config --global user.email "email-akun-github@example.com"
```
Buat repository baru di github.com (tombol **+ → New repository**), **Public**, JANGAN
centang "Add a README file".

## 3. Push folder ini ke GitHub
Masuk ke folder `frontend_web` ini di terminal, lalu:
```bash
git init
git add .
git commit -m "MY HOMS frontend web (akun uji)"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
Saat diminta kredensial: **Username** = username GitHub Anda, **Password** = Personal
Access Token (PAT), bukan password akun. Buat token di
`https://github.com/settings/tokens` → Generate new token (classic) → centang **repo**.

## 4. Aktifkan GitHub Pages
Repo → **Settings** → **Pages** → Source: `Deploy from a branch` → Branch: `main`,
folder `/ (root)` → **Save**. Tunggu 1–2 menit, situs akan muncul di:
`https://USERNAME.github.io/NAMA-REPO/`

## 5. Uji
- Buka URL di atas. Pastikan login MY HOMS tampil (bukan halaman kosong/404 CSS).
- Buka DevTools (F12) → tab **Application** → **Manifest** dan **Service Workers**
  harus hijau/terisi (indikator PWA aktif, bisa "Pasang aplikasi" di HP/Chrome).
- Coba login dengan akun uji yang sudah dibuat di backend.

## 6. Update berikutnya
Setiap ada perubahan file di folder ini:
```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```
Perubahan di backend (Kode.gs) tetap lewat Apps Script: Deploy > Manage deployments >
Edit (pensil) > Version: New version — URL `/exec` tidak berubah, jadi `config.js`
frontend tidak perlu diubah lagi.

## Catatan jujur tentang cakupan
- Frontend ini adalah **port langsung** dari UI MY HOMS yang sudah ada (dual-mode
  google.script.run / fetch, sudah ditulis sejak v1.35.0) — bukan dibangun ulang dari
  nol. Semua ~40 modul yang ada di versi Blogger/iframe ikut tersedia di sini karena
  memakai file `js/app.js` yang sama.
- Fitur baru di rilis ini (CRM & Notifikasi WA) BELUM punya tampilan UI khusus — baru
  tersedia lewat aksi API (lihat README_PASANG.txt paket backend, bagian C). Menambah
  layar UI untuk itu adalah langkah lanjutan terpisah.
- PWA (manifest + service worker) baru ditambahkan di rilis ini dan belum diuji di
  perangkat nyata — setelah deploy, mohon dicoba "Tambahkan ke layar utama" di HP
  Android/iOS dan laporkan bila ada yang aneh.
