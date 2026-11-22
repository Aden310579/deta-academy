import Link from "next/link";
import type { Level } from "@/content/curriculum";
import { levelPrev, levelStat, levelNext, type Student } from "@/lib/student";

/** Pesan untuk level yang belum terbuka: arahkan murid ke level sebelumnya. */
export default function LevelLock({ L, s }: { L: Level; s: Student }) {
  const prev = levelPrev(L);
  if (!prev) return null;
  const ps = levelStat(s, prev);
  return (
    <div className="note warn" style={{ marginTop: 24 }}>
      <b>🔒 {L.school} masih terkunci</b>
      Level ini terbuka setelah semua modul dan kuis di {prev.school} selesai. Tinggal {ps.remaining} modul lagi.{" "}
      {s.user ? <Link href={levelNext(s, prev)}>Lanjutkan {prev.school} →</Link> : <Link href="/masuk">Masuk untuk menyimpan progres →</Link>}
    </div>
  );
}
