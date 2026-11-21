import Link from "next/link";
import Badge from "./Badge";
import type { Level } from "@/content/curriculum";
import { levelStat, type Student } from "@/lib/student";
export default function TierCard({ L, s, cur }: { L: Level; s: Student; cur?: boolean }) {
  const st = levelStat(s, L);
  return (
    <Link className={"tier" + (cur ? " cur" : "")} href={`/kelas/${L.slug}`} style={{ ["--c1" as any]: L.c1 }}>
      <Badge L={L} size={56} earned={st.complete} />
      <div>
        <span className="eyebrow">{L.n}</span><b>{L.school}</b>
        <div className="prog"><i style={{ width: st.pct + "%", background: L.c1 }} /></div>
        <small>{st.complete ? "Lulus ✓" : `${st.done}/${st.total} modul selesai`}</small>
      </div>
    </Link>
  );
}
