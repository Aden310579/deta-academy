import Link from "next/link";
import { MODS, lessonKey } from "@/content/curriculum";
import type { Student } from "@/lib/student";
export default function Rail({ id, active, s }: { id: string; active: number | "q"; s: Student }) {
  const m = MODS[id];
  return (
    <aside className="rail" aria-label="Daftar pelajaran">
      <p className="rt">Modul {m.n}: {m.title}</p>
      {m.lessons.map((l, i) => { const ok = s.done[lessonKey(id, i)]; return (
        <Link key={i} className={active === i ? "on" : ""} href={`/modul/${id}/${i + 1}`}><span className={"d " + (ok ? "ok" : "")}>{ok ? "✓" : ""}</span><span>{l.t}</span></Link>
      ); })}
      <Link className={active === "q" ? "on" : ""} href={`/modul/${id}/kuis`}><span className={"d " + ((s.quiz[id] ?? 0) >= 2 ? "ok" : "")}>{(s.quiz[id] ?? 0) >= 2 ? "✓" : ""}</span><span>Kuis Modul {m.n}</span></Link>
    </aside>
  );
}
