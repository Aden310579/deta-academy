import Link from "next/link";
import { notFound } from "next/navigation";
import { MODS, ORDER, lessonKey } from "@/content/curriculum";
import { getStudent, canAccess } from "@/lib/student";
import Rail from "@/components/Rail";
import Paywall from "@/components/Paywall";
import MarkDone from "@/components/MarkDone";
import LotCalculator from "@/components/LotCalculator";
import Video from "@/components/Video";

export default async function LessonPage({ params }: { params: Promise<{ id: string; lesson: string }> }) {
  const { id, lesson } = await params;
  const m = MODS[id]; const i = parseInt(lesson, 10) - 1;
  if (!m || !m.lessons[i]) notFound();
  const l = m.lessons[i], s = await getStudent(), open = canAccess(s, id);
  const prev = i > 0 ? `/modul/${id}/${i}` : m.n > 1 ? `/modul/${ORDER[m.n - 2]}/kuis` : null;
  const next = i < m.lessons.length - 1 ? `/modul/${id}/${i + 2}` : `/modul/${id}/kuis`;
  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Beranda</Link><span>/</span><Link href={`/modul/${id}`}>Modul {m.n}: {m.title}</Link><span>/</span><span>Pelajaran {i + 1}</span></div>
      <div className="lesson">
        <Rail id={id} active={i} s={s} />
        <article className="prose">
          <div className="eyebrow">Modul {m.n} · Pelajaran {i + 1} dari {m.lessons.length}</div>
          <h1>{l.t}</h1>
          <div className="sub">{l.min} menit baca</div>
          {open ? (
            <>
              {l.video && <Video url={l.video} title={l.t} />}
              <div dangerouslySetInnerHTML={{ __html: l.b }} />
              {l.calc && <LotCalculator />}
              <div className="lnav">
                {prev ? <Link className="btn" href={prev}>← Sebelumnya</Link> : <span />}
                <MarkDone modId={id} index={i} done={!!s.done[lessonKey(id, i)]} loggedIn={!!s.user} next={next} nextLabel={i < m.lessons.length - 1 ? "Lanjut" : "Ke kuis"} />
              </div>
            </>
          ) : <Paywall loggedIn={!!s.user} />}
        </article>
      </div>
    </div>
  );
}
