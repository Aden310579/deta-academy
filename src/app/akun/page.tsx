import Link from "next/link";
import { redirect } from "next/navigation";
import { LEVELS, MODS } from "@/content/curriculum";
import { getStudent, modStat, overall, nextStep } from "@/lib/student";

export default async function Akun() {
  const s = await getStudent();
  if (!s.user) redirect("/masuk?next=/akun");
  const p = overall(s), nx = nextStep(s);
  return (
    <div className="wrap" style={{ paddingBlock: "40px 64px" }}>
      <div className="mhead">
        <div>
          <div className="eyebrow">Akun murid</div>
          <h1 style={{ marginTop: 10 }}>{s.name || s.user.email}</h1>
          <p>{s.isMember ? `Premium aktif${s.memberUntil && new Date(s.memberUntil).getFullYear() < 2090 ? " sampai " + new Date(s.memberUntil).toLocaleDateString("id-ID", { dateStyle: "long" }) : " seumur hidup"}.` : "Akun gratis. Level 1 terbuka."}</p>
          <div className="cta" style={{ marginTop: 16 }}>
            {nx && <Link className="btn primary" href={nx}>Lanjutkan belajar →</Link>}
            {!s.isMember && <Link className="btn" href="/harga">Upgrade ke Premium</Link>}
            <form action="/keluar" method="post"><button className="btn" type="submit">Keluar</button></form>
          </div>
        </div>
        <div className="ring" style={{ ["--p" as any]: p }}><span>{p}%</span></div>
      </div>
      {LEVELS.map((L) => (
        <div className="level" key={L.n}>
          <div className="level-tag"><span className="num">{L.n}</span><h3>{L.name}</h3></div>
          <div className="tbl" style={{ margin: 0 }}><table><thead><tr><th>Modul</th><th>Pelajaran</th><th>Kuis</th><th>Progres</th></tr></thead><tbody>
            {L.mods.map((id) => { const st = modStat(s, id); return (
              <tr key={id}><td><Link href={`/modul/${id}`}>{MODS[id].n}. {MODS[id].title}</Link></td><td className="n">{st.d}/{st.n}</td><td className="n">{s.quiz[id] !== undefined ? `${s.quiz[id]}/3` : "–"}</td><td className="n">{st.pct}%</td></tr>
            ); })}
          </tbody></table></div>
        </div>
      ))}
    </div>
  );
}
