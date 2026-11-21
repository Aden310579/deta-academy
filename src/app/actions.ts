"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { QUIZ_N, parseQuizCookie } from "@/lib/quiz";
import { createClient } from "@/lib/supabase/server";
import { getStudent, canAccess } from "@/lib/student";
import { MODS } from "@/content/curriculum";

export async function setLessonDone(modId: string, index: number, done: boolean) {
  const s = await getStudent();
  if (!s.user) return { error: "login" };
  const m = MODS[modId];
  if (!m || !m.lessons[index] || !canAccess(s, modId)) return { error: "akses" };
  const sb = await createClient();
  const key = `${modId}-l${index + 1}`;
  if (done) await sb.from("progress").upsert({ user_id: s.user.id, lesson_key: key });
  else await sb.from("progress").delete().eq("user_id", s.user.id).eq("lesson_key", key);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Server menilai jawaban sendiri supaya skor tidak bisa dipalsukan dari browser.
 *  Saat belum lulus, kunci jawaban dan pembahasan tidak dikirim. Soal yang baru dipakai
 *  dicatat lewat newQuizAttempt supaya percobaan berikutnya memakai soal lain. */
export async function submitQuiz(modId: string, picks: { qi: number; ans: number }[]) {
  const m = MODS[modId];
  if (!m || !Array.isArray(picks) || picks.length !== QUIZ_N) return { error: "soal" };
  const ids = picks.map((p) => p.qi);
  if (new Set(ids).size !== QUIZ_N || ids.some((i) => !Number.isInteger(i) || !m.quiz[i])) return { error: "soal" };
  const ok = picks.map((p) => p.ans === m.quiz[p.qi].a);
  const score = ok.filter(Boolean).length, pass = score >= 2;
  const s = await getStudent();
  if (s.user && canAccess(s, modId)) {
    const sb = await createClient();
    const best = Math.max(score, s.quiz[modId] ?? 0);
    await sb.from("quiz_scores").upsert({ user_id: s.user.id, module_id: modId, best_score: best, updated_at: new Date().toISOString() });
    revalidatePath("/", "layout");
  }
  return { score, pass, ok, correct: pass ? picks.map((p) => m.quiz[p.qi].a) : null, ex: pass ? picks.map((p) => m.quiz[p.qi].ex) : null, saved: !!s.user };
}

export async function setCertName(name: string) {
  const s = await getStudent();
  if (!s.user) return { error: "login" };
  const sb = await createClient();
  await sb.from("profiles").update({ full_name: name.trim().slice(0, 40) }).eq("id", s.user.id);
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Mulai percobaan baru: soal yang barusan dipakai disisihkan dan urutan diacak ulang. */
export async function newQuizAttempt(modId: string, usedIds: number[]) {
  if (!MODS[modId]) return { error: "modul" };
  const store = await cookies();
  const prev = parseQuizCookie(store.get(`dq_${modId}`)?.value).seen;
  // Ingat soal dari dua percobaan terakhir, jadi bank 9 soal berputar penuh sebelum ada soal yang terulang.
  const used = usedIds.filter((i) => Number.isInteger(i) && MODS[modId].quiz[i]).slice(0, QUIZ_N);
  const ids = [...new Set([...used, ...prev])].slice(0, QUIZ_N * 2);
  const seed = Math.floor(Math.random() * 1e9);
  store.set(`dq_${modId}`, `${ids.join(".")}~${seed}`, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true });
  return { ok: true };
}
