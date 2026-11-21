import Link from "next/link";
import CheckoutButton from "./CheckoutButton";
import { priceIdr, rupiah } from "@/lib/student";
export default function Paywall({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="upsell" style={{ marginTop: 24 }}>
      <div><div className="eyebrow">Materi Premium</div><h3>Modul ini untuk anggota Premium</h3><p>Sekali bayar {rupiah(priceIdr())} untuk membuka Level 2 dan 3, termasuk video dan kuis. Level 1 tetap gratis.</p></div>
      {loggedIn ? <CheckoutButton /> : <Link className="btn primary" href="/masuk?next=/harga">Masuk untuk bergabung</Link>}
    </div>
  );
}
