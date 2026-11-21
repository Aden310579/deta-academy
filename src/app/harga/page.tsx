import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { getStudent, priceIdr, rupiah } from "@/lib/student";

export default async function Harga() {
  const s = await getStudent();
  const days = parseInt(process.env.MEMBERSHIP_DAYS || "0", 10);
  return (
    <div className="wrap" style={{ paddingBlock: "40px 64px" }}>
      <div className="eyebrow">Harga</div>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", marginTop: 10 }}>Mulai gratis, lanjut saat siap.</h1>
      <div className="plans">
        <div className="plan">
          <span className="eyebrow">Gratis</span>
          <b className="price">Rp0</b>
          <ul><li>Level 1: Fondasi (3 modul)</li><li>Kuis dan progres tersimpan</li><li>Kalkulator lot</li></ul>
          <Link className="btn" href="/modul/m1/1">Mulai belajar</Link>
        </div>
        <div className="plan pro">
          <span className="eyebrow">Premium</span>
          <b className="price">{rupiah(priceIdr())}</b>
          <span className="muted">{days > 0 ? `akses ${days} hari` : "sekali bayar, akses seumur hidup"}</span>
          <ul><li>Semua 10 modul, Level 1 sampai 3</li><li>Video di setiap pelajaran yang tersedia</li><li>Manajemen risiko, psikologi, dan strategi H4–M15</li><li>Materi baru tanpa biaya tambahan</li></ul>
          {s.isMember ? <span className="chip ok" style={{ alignSelf: "start" }}>Kamu sudah Premium</span> : s.user ? <CheckoutButton /> : <Link className="btn primary" href="/masuk?next=/harga">Masuk untuk bergabung</Link>}
          <small className="muted">Bayar lewat QRIS, transfer bank (VA), GoPay, ShopeePay, atau kartu. Diproses oleh Midtrans.</small>
        </div>
      </div>
    </div>
  );
}
