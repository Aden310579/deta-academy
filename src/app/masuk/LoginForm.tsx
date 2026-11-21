"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState(""), [sent, setSent] = useState(false), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const site = typeof window !== "undefined" ? window.location.origin : "";
  const cb = `${site}/auth/callback?next=${encodeURIComponent(next)}`;
  const magic = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: cb } });
    setBusy(false);
    if (error) setErr("Email belum bisa dikirim. Periksa alamatnya lalu coba lagi."); else setSent(true);
  };
  const google = async () => { await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: cb } }); };
  if (sent) return <div className="note ok"><b>Cek emailmu</b>Link masuk sudah dikirim ke {email}. Buka link itu dari perangkat ini.</div>;
  return (
    <div className="auth-form">
      <button className="btn" type="button" onClick={google} style={{ justifyContent: "center" }}>Lanjut dengan Google</button>
      <div className="or"><span>atau</span></div>
      <form onSubmit={magic} className="auth-form">
        <label htmlFor="email">Email<input id="email" type="email" required autoComplete="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <button className="btn primary" type="submit" disabled={busy} style={{ justifyContent: "center" }}>{busy ? "Mengirim..." : "Kirim link masuk"}</button>
        {err && <p style={{ color: "var(--bear)", margin: 0 }}>{err}</p>}
      </form>
    </div>
  );
}
