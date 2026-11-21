"use client";
import { useRef, useState } from "react";
import { setCertName } from "@/app/actions";
export default function CertName({ initial }: { initial: string }) {
  const [v, setV] = useState(initial), [msg, setMsg] = useState("Ambil screenshot untuk dibagikan.");
  const t = useRef<any>(null);
  const change = (x: string) => {
    setV(x);
    document.querySelectorAll("#certNameOut").forEach((e) => (e.textContent = x || "Nama kamu"));
    clearTimeout(t.current);
    t.current = setTimeout(async () => { setMsg("Menyimpan..."); const r = await setCertName(x); setMsg(r.ok ? "Tersimpan. Ambil screenshot untuk dibagikan." : "Belum tersimpan. Coba lagi."); }, 700);
  };
  return (
    <div className="cert-form">
      <label htmlFor="certName">Nama di sertifikat<input id="certName" type="text" maxLength={40} placeholder="Tulis nama lengkapmu" value={v} onChange={(e) => change(e.target.value)} /></label>
      <span className="muted">{msg}</span>
    </div>
  );
}
