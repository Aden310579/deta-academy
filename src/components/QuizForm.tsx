"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitQuiz, newQuizAttempt } from "@/app/actions";

type Q = { qi: number; q: string; o: { i: number; t: string }[] };
type Res = { score: number; pass: boolean; ok: boolean[]; correct: number[] | null; ex: string[] | null; saved: boolean };

export default function QuizForm({ modId, n, quiz, nextHref }: { modId: string; n: number; quiz: Q[]; nextHref: string | null }) {
  const [ans, setAns] = useState<number[]>(quiz.map(() => -1));
  const [res, setRes] = useState<Res | null>(null);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ans.includes(-1)) { setErr("Jawab semua soal dulu."); return; }
    setErr("");
    start(async () => {
      const r: any = await submitQuiz(modId, quiz.map((q, k) => ({ qi: q.qi, ans: ans[k] })));
      if (r.error) setErr("Kuis belum bisa dinilai. Muat ulang halaman lalu coba lagi."); else setRes(r);
    });
  };
  const retry = () => start(async () => { await newQuizAttempt(modId, quiz.map((q) => q.qi)); router.refresh(); window.scrollTo(0, 0); });
  return (
    <form onSubmit={submit}>
      {quiz.map((q, k) => (
        <fieldset className="q" key={q.qi}>
          <p className="qt">{k + 1}. {q.q}</p>
          <div className="opts">
            {q.o.map((o) => {
              let cls = "";
              if (res) {
                if (res.pass && res.correct![k] === o.i) cls = "right";
                else if (ans[k] === o.i) cls = res.ok[k] ? "right" : "wrong";
              }
              return (
                <label key={o.i} htmlFor={`q${k}o${o.i}`} className={cls}>
                  <input type="radio" id={`q${k}o${o.i}`} name={`q${k}`} disabled={!!res} checked={ans[k] === o.i} onChange={() => setAns(ans.map((a, i) => (i === k ? o.i : a)))} />
                  <span>{o.t}</span>
                </label>
              );
            })}
          </div>
          {res && <p className="ex">{res.pass ? (res.ok[k] ? "Benar. " : "Belum tepat. ") + res.ex![k] : res.ok[k] ? "Benar." : "Belum tepat. Jawaban yang benar tidak ditampilkan supaya kamu bisa belajar ulang."}</p>}
        </fieldset>
      ))}
      {err && <p style={{ color: "var(--bear)" }}>{err}</p>}
      {!res && <div className="cta"><button className="btn primary" type="submit" disabled={pending}>{pending ? "Memeriksa..." : "Periksa jawaban"}</button></div>}
      {res && (
        <>
          <div className="score"><b className="mono">{res.score}/{quiz.length}</b><div>{res.pass ? `Lulus. Modul ${n} selesai.` : "Belum lulus. Baca ulang pelajarannya, lalu coba lagi. Percobaan berikutnya memakai soal yang berbeda."}{!res.saved && " Masuk agar nilaimu tersimpan."}</div></div>
          <div className="lnav">
            {res.pass ? <Link className="btn" href={`/modul/${modId}`}>Kembali ke modul</Link> : <Link className="btn" href={`/modul/${modId}/1`}>Baca ulang modul</Link>}
            {res.pass && nextHref && <Link className="btn primary" href={nextHref}>Lanjut ke Modul {n + 1} →</Link>}
            {!res.pass && <button className="btn primary" type="button" onClick={retry} disabled={pending}>Coba lagi dengan soal baru →</button>}
          </div>
        </>
      )}
    </form>
  );
}
