import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, MODS } from "@/content/curriculum";
import Badge from "@/components/Badge";
import TierCard from "@/components/TierCard";
import CertName from "@/components/CertName";
import { getStudent, modStat, levelBySlug, levelStat, levelNext, certNo } from "@/lib/student";

export default async function KelasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const L = levelBySlug(slug); if (!L) notFound();
  const s = await getStudent(), st = levelStat(s, L), idx = LEVELS.indexOf(L), prev = LEVELS[idx - 1];
  const prevOk = !prev || levelStat(s, prev).complete;
  const mins = L.mods.reduce((a, id) => a + MODS[id].lessons.reduce((b, l) => b + l.min, 0), 0);
  const lessons = L.mods.reduce((a, id) => a + MODS[id].lessons.length, 0);
  const next = levelNext(s, L);
  const grad = st.gradAt ? new Date(st.gradAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const vars = { ["--c1" as any]: L.c1, ["--c2" as any]: L.c2 };
  return (
    <>
      <section className="lvl-hero" style={vars}><div className="wrap">
        <div className="crumb"><Link href="/">Beranda</Link><span>/</span><Link href="/#kurikulum">Kurikulum</Link><span>/</span><span>{L.school}</span></div>
        <div className="lvl-grid">
          <div className="hero-copy">
            <div className="eyebrow lvl-eye">{L.n} dari 3 · {L.name}</div>
            <h1>{L.school}</h1>
            <p className="lead">{L.desc}</p>
            <ul className="outcomes">{L.outcomes.map((o) => <li key={o}><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill={L.c1} /><path d="M6 10.5l2.6 2.6L14 7.6" fill="none" stroke="#fff" strokeWidth="2" /></svg>{o}</li>)}</ul>
            <div className="cta"><Link className="btn primary" href={next}>{st.pct === 0 ? "Mulai kelas" : st.complete ? "Ulas materi" : "Lanjutkan kelas"} →</Link><a className="btn" href="#sertifikat">{st.complete ? "Lihat sertifikat" : "Lihat sertifikat kelas"}</a></div>
            <div className="mini-stats"><div><b className="mono">{L.mods.length}</b>modul</div><div><b className="mono">±{Math.round(mins / 6) / 10} jam</b>waktu baca</div><div><b className="mono">{st.pct}%</b>progres kelas</div></div>
          </div>
          <div className="lvl-badge"><Badge L={L} size={200} earned={st.complete} /><span className={"chip " + (st.complete ? "ok" : "")}>{st.complete ? "Lencana diraih" : "Lencana menunggu"}</span></div>
        </div>
      </div></section>
      <div className="wrap">
        {!prevOk && <div className="note warn" style={{ marginTop: 28 }}><b>Saran urutan</b>Kelas ini memakai istilah dari {prev.school}. Kamu tetap boleh membuka materinya, tapi akan lebih mudah kalau {prev.school} diselesaikan dulu. <Link href={`/kelas/${prev.slug}`}>Buka {prev.school} →</Link></div>}
        <div className="section-head" style={{ marginTop: 40 }}><div><div className="eyebrow">Materi</div><h2 style={{ marginTop: 8 }}>Modul di {L.school}</h2></div></div>
        <div className="mods">
          {L.mods.map((id) => { const m = MODS[id], ms = modStat(s, id), locked = !m.free && !s.isMember; return (
            <Link className="mod" href={`/modul/${id}`} key={id}>
              <div className="top"><span className="code">MODUL {String(m.n).padStart(2, "0")}</span>{locked ? <span className="chip">🔒 Premium</span> : ms.pct === 100 ? <span className="chip ok">Selesai</span> : <span className="chip">{m.lessons.length} pelajaran</span>}</div>
              <h4>{m.title}</h4><p>{m.desc}</p>
              <div className="prog"><i style={{ width: ms.pct + "%" }} /></div>
              <div className="meta"><span>{ms.d}/{ms.n} pelajaran{ms.q ? " · kuis ✓" : ""}</span><span>{ms.pct}%</span></div>
            </Link>
          ); })}
        </div>
        <section className="cert-wrap" id="sertifikat">
          <div className="section-head"><div><div className="eyebrow">Sertifikat</div><h2 style={{ marginTop: 8 }}>{st.complete ? `Kamu lulus ${L.school}` : `Sertifikat ${L.school}`}</h2></div></div>
          <div className={"cert" + (st.complete ? "" : " locked")} style={vars}>
            <div className="cert-in">
              <div className="cert-top"><span className="cert-brand"><span className="logo-img" role="img" aria-label="DETA Expert.com" /><span className="lg-tag">Academy</span></span><span className="mono">No. {st.complete && s.user ? certNo(L, s.user.id) : "DA-XXX-XXXXXX"}</span></div>
              <div className="cert-badge"><Badge L={L} size={92} earned={st.complete} /></div>
              <p className="cert-k">Sertifikat Kelulusan</p>
              <h3 className="cert-name" id="certNameOut">{s.name || "Nama kamu"}</h3>
              <p className="cert-txt">telah menyelesaikan seluruh modul dan kuis <b>{L.school}</b> ({L.n} · {L.name}) di Deta Academy.</p>
              <div className="cert-foot"><div><b>{grad}</b><span>Tanggal lulus</span></div><div><b>{L.mods.length} modul · {lessons} pelajaran</b><span>Materi yang ditempuh</span></div><div className="sig"><b>Tim Deta Academy</b><span>Pengajar</span></div></div>
            </div>
            {!st.complete && (
              <div className="cert-lock"><b>{s.user ? `Selesaikan ${st.remaining} modul lagi` : "Masuk untuk meraih sertifikat"}</b><span>Sertifikat terbuka setelah semua pelajaran dan kuis di {L.school} selesai.</span><Link className="btn primary" href={s.user ? next : "/masuk"}>{s.user ? "Lanjutkan kelas →" : "Masuk"}</Link></div>
            )}
          </div>
          {st.complete && s.user && <CertName initial={s.name || ""} />}
        </section>
        <div className="section-head"><div><div className="eyebrow">Jalur sekolah</div><h2 style={{ marginTop: 8 }}>Tiga kelas</h2></div></div>
        <div className="tiers" style={{ marginBottom: 56 }}>{LEVELS.map((x) => <TierCard key={x.slug} L={x} s={s} cur={x === L} />)}</div>
      </div>
    </>
  );
}
