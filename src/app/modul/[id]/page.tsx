import Link from "next/link";
import { notFound } from "next/navigation";
import { MODS, levelOf, lessonKey } from "@/content/curriculum";
import { getStudent, modStat, canAccess } from "@/lib/student";
import Paywall from "@/components/Paywall";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = MODS[id]; if (!m) notFound();
  const s = await getStudent(), st = modStat(s, id), L = levelOf(id), open = canAccess(s, id);
  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Beranda</Link><span>/</span><Link href={`/kelas/${L.slug}`}>{L.school}</Link><span>/</span><span>Modul {m.n}</span></div>
      <div className="mhead">
        <div><div className="eyebrow">Modul {String(m.n).padStart(2, "0")} · {m.lessons.reduce((a, l) => a + l.min, 0)} menit · {m.free ? "Gratis" : "Premium"}</div><h1 style={{ marginTop: 10 }}>{m.title}</h1><p>{m.desc}</p></div>
        <div className="ring" style={{ ["--p" as any]: st.pct }}><span>{st.pct}%</span></div>
      </div>
      {!open && <Paywall loggedIn={!!s.user} />}
      <ol className="llist">
        {m.lessons.map((l, i) => {
          const ok = s.done[lessonKey(id, i)];
          return (
            <li key={i}><Link href={`/modul/${id}/${i + 1}`}>
              <span className={"ix " + (ok ? "ok" : "")}>{ok ? "✓" : i + 1}</span>
              <span><b>{l.t}</b><small>{l.min} menit{l.video ? " · ada video" : ""}</small></span>
              <span className={"chip " + (ok ? "ok" : "")}>{!open ? "🔒" : ok ? "Selesai" : "Buka"}</span>
            </Link></li>
          );
        })}
        <li><Link className="quiz" href={`/modul/${id}/kuis`}>
          <span className={"ix " + (st.q ? "ok" : "")}>{st.q ? "✓" : "?"}</span>
          <span><b>Kuis Modul {m.n}</b><small>3 soal acak · lulus minimal 2 benar{s.quiz[id] !== undefined ? ` · skor terbaik ${s.quiz[id]}/3` : ""}</small></span>
          <span className={"chip " + (st.q ? "ok" : "go")}>{!open ? "🔒" : st.q ? "Lulus" : "Kerjakan"}</span>
        </Link></li>
      </ol>
    </div>
  );
}
