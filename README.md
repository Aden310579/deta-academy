# Deta Academy

Website sekolah trading: 10 modul dari nol sampai bisa, login murid, Level 1 gratis, Level 2–3 Premium (bayar lewat Midtrans), progres dan nilai kuis tersimpan per akun, dan slot video per pelajaran.

Dibangun dengan Next.js 15, Supabase (login + database), dan Midtrans (pembayaran). Siap di-hosting di Vercel.

## Langkah pemasangan (±30 menit)

### 1. Supabase (login dan database), gratis
1. Daftar di https://supabase.com lalu buat project baru (region Singapore).
2. Buka **SQL Editor**, tempel isi `supabase/schema.sql`, lalu **Run**.
3. Buka **Authentication → URL Configuration**: isi *Site URL* dengan alamat website, dan tambahkan `https://domainmu/auth/callback` di *Redirect URLs*.
4. (Opsional) **Authentication → Providers → Google** untuk tombol "Lanjut dengan Google".
5. Salin `Project URL`, `anon key`, dan `service_role key` dari **Project Settings → API**.

### 2. Midtrans (pembayaran)
1. Daftar di https://dashboard.midtrans.com. Mulai di mode **Sandbox** untuk uji coba.
2. **Settings → Access Keys**: salin *Server Key*.
3. **Settings → Payment → Notification URL**: isi `https://domainmu/api/midtrans`.
4. Setelah akun diverifikasi Midtrans, ganti ke key Production dan set `MIDTRANS_IS_PRODUCTION=true`.

### 3. Vercel (hosting), gratis
1. Upload folder ini ke repo GitHub, lalu import di https://vercel.com.
2. Isi Environment Variables sesuai `.env.example`.
3. Deploy. Sambungkan domain di **Settings → Domains**.

## Menjalankan di komputer sendiri
```bash
cp .env.example .env.local   # isi nilainya
npm install
npm run dev                  # buka http://localhost:3000
```
Tanpa isi Supabase, website tetap jalan dalam mode tamu (Level 1 bisa dibaca, progres tidak tersimpan).

## Mengubah konten
Semua materi ada di `src/content/curriculum.js`.
- **Tambah video**: pada pelajaran, tambahkan `video:'https://youtu.be/XXXXXXXXXXX'` (YouTube unlisted atau Vimeo).
- **Modul gratis**: diatur di baris `MODS[id].free = i < 3` (3 modul pertama gratis).
- **Harga**: `PRICE_IDR`. Lama akses: `MEMBERSHIP_DAYS` (0 = seumur hidup).

## Memberi Premium manual
Di Supabase → Table Editor → `profiles`, isi `member_until` murid (misal `2099-12-31`).
