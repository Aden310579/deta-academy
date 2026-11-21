import Link from "next/link";
import { ChartHero, Arena } from "@/components/Fx";
import Badge from "@/components/Badge";
import TierCard from "@/components/TierCard";
import { LEVELS, MODS, ORDER } from "@/content/curriculum";
import { getStudent, modStat, overall, nextStep, priceIdr, rupiah, levelStat } from "@/lib/student";

export default async function Home() {
  const s = await getStudent();
  const p = overall(s), nx = nextStep(s);
  const totalLessons = ORDER.reduce((a, id) => a + MODS[id].lessons.length, 0);
  const totalMin = ORDER.reduce((a, id) => a + MODS[id].lessons.reduce((b, l) => b + l.min, 0), 0);
  return (
    <>
      <section className="hero-band"><div className="wrap hero">
        <div className="hero-copy">
          <div className="badge-live"><span className="dot" />Kelas dibuka · Kelas Pemula gratis</div>
          <h1 style={{ marginTop: 16 }}>Belajar membaca pasar, <em>satu candle</em> demi satu candle.</h1>
          <p className="lead">Tiga kelas berurutan, dari mengenal pip sampai menyusun trading plan sendiri. Chart interaktif, arena latihan, video, kuis, lencana, dan sertifikat di setiap kelas.</p>
          <div className="cta">
            <Link className="btn primary" href={nx || "/kelas/mahir"}>{p === 0 ? "Mulai Kelas Pemula" : p === 100 ? "Ulas materi" : "Lanjutkan belajar"} →</Link>
            <Link className="btn" href="#arena">Coba arena latihan</Link>
          </div>
          <div className="mini-stats"><div><b className="mono">{totalLessons}</b>pelajaran</div><div><b className="mono">3</b>kelas bersertifikat</div><div><b className="mono">{s.user ? p + "%" : "Gratis"}</b>{s.user ? "progres kamu" : "Kelas Pemula"}</div></div>
        </div>
        <ChartHero />
      </div></section>
      <div className="wrap">
        <div className="facts">
          <div><b className="mono">3</b><span>kelas sekolah</span></div>
          <div><b className="mono">{totalLessons}</b><span>pelajaran singkat</span></div>
          <div><b className="mono">±{Math.round((totalMin / 60) * 10) / 10} jam</b><span>total waktu baca</span></div>
          <div><b className="mono">{s.user ? p + "%" : "10"}</b><span>{s.user ? "progres kamu" : "kuis modul"}</span></div>
        </div>
        <div className="section-head" id="kurikulum">
          <div><div className="eyebrow">Kurikulum</div><h2 style={{ marginTop: 8 }}>Tiga kelas, satu jalur</h2></div>
          <span style={{ color: "var(--muted)", fontSize: 14, maxWidth: "44ch" }}>Mulai dari Kelas Pemula. Setiap kelas punya lencana dan sertifikat kelulusan sendiri.</span>
        </div>
        <div className="tiers">{LEVELS.map((L) => <TierCard key={L.slug} L={L} s={s} />)}</div>
        {LEVELS.map((L) => (
          <div className="level" key={L.n} style={{ ["--c1" as any]: L.c1 }}>
            <div className="level-tag">
              <Badge L={L} size={64} earned={levelStat(s, L).complete} />
              <span className="num">{L.n} · {L.name}</span><h3>{L.school}</h3><p>{L.tagline}</p>
              <Link className="lvl-link" href={`/kelas/${L.slug}`}>Masuk kelas →</Link>
            </div>
            <div className="mods">
              {L.mods.map((id) => {
                const m = MODS[id], st = modStat(s, id), locked = !m.free && !s.isMember;
                const chip = locked ? <span className="chip">🔒 Premium</span> : st.pct === 100 ? <span className="chip ok">Selesai</span> : st.pct > 0 ? <span className="chip go">Berjalan</span> : <span className="chip">{m.free ? "Gratis" : `${m.lessons.length} pelajaran`}</span>;
                return (
                  <Link className="mod" href={`/modul/${id}`} key={id}>
                    <div className="top"><span className="code">MODUL {String(m.n).padStart(2, "0")}</span>{chip}</div>
                    <h4>{m.title}</h4><p>{m.desc}</p>
                    <div className="prog"><i style={{ width: st.pct + "%" }} /></div>
                    <div className="meta"><span>{st.d}/{st.n} pelajaran{st.q ? " · kuis ✓" : ""}</span><span>{st.pct}%</span></div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {!s.isMember && (
          <div className="upsell">
            <div><div className="eyebrow">Premium</div><h3>Buka Kelas Menengah dan Kelas Mahir</h3><p>Analisa, manajemen risiko, psikologi, dan strategi lengkap. Bayar sekali {rupiah(priceIdr())} lewat QRIS, transfer bank, atau e-wallet.</p></div>
            <Link className="btn primary" href="/harga">Lihat harga →</Link>
          </div>
        )}
        <div style={{ marginTop: 56 }}><Arena /></div>
        <div className="rules" id="cara-belajar">
          <div><span className="eyebrow">Baca &amp; tonton</span><h4>Satu pelajaran sehari</h4><p>Tiap pelajaran 5–9 menit. Lebih baik pelan tapi paham daripada maraton lalu lupa.</p></div>
          <div><span className="eyebrow">Latih</span><h4>Arena dan chart demo</h4><p>Asah insting di arena latihan, lalu cari contohnya di chart sungguhan.</p></div>
          <div><span className="eyebrow">Lulus</span><h4>Raih lencana dan sertifikat</h4><p>Selesaikan semua modul dan kuis sebuah kelas untuk membuka sertifikat kelulusan.</p></div>
        </div>
      </div>
    </>
  );
}
