import Link from "next/link";
import { getStudent } from "@/lib/student";
export const dynamic = "force-dynamic";
export default async function Selesai() {
  const s = await getStudent();
  return (
    <div className="wrap auth"><div className="auth-card">
      {s.isMember ? (<><div className="eyebrow">Pembayaran diterima</div><h1>Selamat datang di Premium</h1><p className="muted">Semua modul sudah terbuka. Lanjutkan ke Level 2.</p><Link className="btn primary" href="/modul/m4/1">Mulai Modul 4 →</Link></>)
        : (<><div className="eyebrow">Menunggu konfirmasi</div><h1>Pembayaran sedang diproses</h1><p className="muted">Kalau kamu bayar lewat transfer bank atau QRIS, konfirmasi bisa butuh beberapa menit. Muat ulang halaman ini setelah pembayaran selesai.</p><Link className="btn" href="/bayar/selesai">Muat ulang</Link></>)}
    </div></div>
  );
}
