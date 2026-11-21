import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { MODS, ORDER } from "@/content/curriculum";
import { getStudent, canAccess } from "@/lib/student";
import { pickQuiz, parseQuizCookie, QUIZ_N } from "@/lib/quiz";
import Rail from "@/components/Rail";
import Paywall from "@/components/Paywall";
import QuizForm from "@/components/QuizForm";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = MODS[id]; if (!m) notFound();
  const s = await getStudent(), open = canAccess(s, id), nextMod = ORDER[m.n];
  const seen = (await cookies()).get(`dq_${id}`)?.value;
  // Kunci jawaban tidak pernah dikirim ke browser sebelum lulus; penilaian di server.
  const quiz = pickQuiz(id, seen);
  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Beranda</Link><span>/</span><Link href={`/modul/${id}`}>Modul {m.n}: {m.title}</Link><span>/</span><span>Kuis</span></div>
      <div className="lesson">
        <Rail id={id} active="q" s={s} />
        <article className="prose">
          <div className="eyebrow">Modul {m.n} · Kuis</div>
          <h1>Cek pemahamanmu</h1>
          <div className="sub">{QUIZ_N} soal acak dari bank {m.quiz.length} soal · lulus minimal 2 benar</div>
          {parseQuizCookie(seen).seen.length > 0 && <div className="note"><b>Soal baru</b>Soal di percobaan ini berbeda dari percobaan sebelumnya, dan urutan jawabannya diacak.</div>}
          {open ? <QuizForm key={quiz.map((q) => q.qi).join(".")} modId={id} n={m.n} quiz={quiz} nextHref={nextMod ? `/modul/${nextMod}/1` : null} /> : <Paywall loggedIn={!!s.user} />}
        </article>
      </div>
    </div>
  );
}
