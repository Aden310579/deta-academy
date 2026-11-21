"use client";
import { useState } from "react";
export default function CheckoutButton({ label = "Gabung Premium" }: { label?: string }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const go = async () => {
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/checkout", { method: "POST" });
      const j = await r.json();
      if (j.login) { window.location.href = "/masuk?next=/harga"; return; }
      if (j.redirect_url) { window.location.href = j.redirect_url; return; }
      setErr(j.error || "Pembayaran belum bisa dibuat. Coba lagi sebentar.");
    } catch { setErr("Koneksi terputus. Coba lagi."); }
    setBusy(false);
  };
  return (<div><button className="btn primary" type="button" onClick={go} disabled={busy}>{busy ? "Membuka pembayaran..." : label}</button>{err && <p style={{ color: "var(--bear)", fontSize: 14 }}>{err}</p>}</div>);
}
