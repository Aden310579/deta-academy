import LoginForm from "./LoginForm";
import { supabaseConfigured } from "@/lib/supabase/server";
export default async function Masuk({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/";
  return (
    <div className="wrap auth">
      <div className="auth-card">
        <div className="eyebrow">Akun murid</div>
        <h1>Masuk atau daftar</h1>
        <p className="muted">Satu akun untuk menyimpan progres, nilai kuis, dan akses Premium. Tidak perlu kata sandi: kami kirim link masuk ke emailmu.</p>
        {sp.error && <p style={{ color: "var(--bear)" }}>Link masuk sudah kedaluwarsa atau tidak valid. Minta link baru di bawah.</p>}
        {supabaseConfigured() ? <LoginForm next={next} /> : <p className="note warn"><b>Belum disambungkan</b>Login aktif setelah Supabase diisi di pengaturan (lihat README).</p>}
      </div>
    </div>
  );
}
