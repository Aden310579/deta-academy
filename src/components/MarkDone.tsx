"use client";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setLessonDone } from "@/app/actions";

export default function MarkDone({ modId, index, done, loggedIn, next, nextLabel }: { modId: string; index: number; done: boolean; loggedIn: boolean; next: string; nextLabel: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  if (!loggedIn) return (<div className="cta"><Link className="btn" href="/masuk">Masuk untuk simpan progres</Link><Link className="btn primary" href={next}>{nextLabel} →</Link></div>);
  return (
    <div className="cta">
      <button className={"btn " + (done ? "done" : "")} type="button" disabled={pending} onClick={() => start(async () => { await setLessonDone(modId, index, !done); router.refresh(); })}>
        {done ? "✓ Sudah selesai" : "Tandai selesai"}
      </button>
      <button className="btn primary" type="button" disabled={pending} onClick={() => start(async () => { if (!done) await setLessonDone(modId, index, true); router.push(next); })}>
        {nextLabel} →
      </button>
    </div>
  );
}
