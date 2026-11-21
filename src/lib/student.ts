import { cache } from "react";
import { createClient, supabaseConfigured } from "./supabase/server";
import { MODS, ORDER, lessonKey } from "@/content/curriculum";

export type Student = {
  user: { id: string; email?: string } | null;
  name: string | null;
  isMember: boolean;
  memberUntil: string | null;
  done: Record<string, boolean>;
  quiz: Record<string, number>;
  quizAt: Record<string, string>;
};

/** Data murid yang sedang login, sekali per request. */
export const getStudent = cache(async (): Promise<Student> => {
  const empty: Student = { user: null, name: null, isMember: false, memberUntil: null, done: {}, quiz: {}, quizAt: {} };
  if (!supabaseConfigured()) return empty;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return empty;
  const [{ data: prof }, { data: prog }, { data: qs }] = await Promise.all([
    sb.from("profiles").select("full_name, member_until").eq("id", user.id).maybeSingle(),
    sb.from("progress").select("lesson_key").eq("user_id", user.id),
    sb.from("quiz_scores").select("module_id, best_score, updated_at").eq("user_id", user.id),
  ]);
  const until = prof?.member_until ?? null;
  const isMember = !!until && new Date(until).getTime() > Date.now();
  return {
    user: { id: user.id, email: user.email },
    name: prof?.full_name ?? null,
    isMember,
    memberUntil: until,
    done: Object.fromEntries((prog ?? []).map((r) => [r.lesson_key, true])),
    quiz: Object.fromEntries((qs ?? []).map((r) => [r.module_id, r.best_score])),
    quizAt: Object.fromEntries((qs ?? []).map((r) => [r.module_id, r.updated_at])),
  };
});

export const canAccess = (s: Student, modId: string) => MODS[modId].free || s.isMember;

export function modStat(s: Student, id: string) {
  const m = MODS[id];
  const d = m.lessons.filter((_, i) => s.done[lessonKey(id, i)]).length;
  const q = (s.quiz[id] ?? 0) >= 2;
  return { d, n: m.lessons.length, q, pct: Math.round(((d + (q ? 1 : 0)) / (m.lessons.length + 1)) * 100) };
}

export function overall(s: Student) {
  let u = 0, t = 0;
  ORDER.forEach((id) => { const st = modStat(s, id); u += st.d + (st.q ? 1 : 0); t += st.n + 1; });
  return Math.round((u / t) * 100);
}

export function nextStep(s: Student) {
  for (const id of ORDER) {
    const m = MODS[id];
    for (let i = 0; i < m.lessons.length; i++) if (!s.done[lessonKey(id, i)]) return `/modul/${id}/${i + 1}`;
    if (!((s.quiz[id] ?? 0) >= 2)) return `/modul/${id}/kuis`;
  }
  return null;
}

export const priceIdr = () => parseInt(process.env.PRICE_IDR || "299000", 10);
export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

import { LEVELS } from "@/content/curriculum";
import type { Level } from "@/content/curriculum";
export const levelBySlug = (slug: string) => LEVELS.find((l) => l.slug === slug);
export function levelStat(s: Student, L: Level) {
  const st = L.mods.map((id) => modStat(s, id));
  const done = st.filter((x) => x.pct === 100).length;
  const complete = done === L.mods.length;
  const gradAt = complete ? L.mods.map((id) => s.quizAt[id]).filter(Boolean).sort().pop() ?? null : null;
  return { done, total: L.mods.length, pct: Math.round(st.reduce((a, x) => a + x.pct, 0) / st.length), complete, remaining: L.mods.length - done, gradAt };
}
export function levelNext(s: Student, L: Level) {
  for (const id of L.mods) {
    const m = MODS[id];
    for (let i = 0; i < m.lessons.length; i++) if (!s.done[lessonKey(id, i)]) return `/modul/${id}/${i + 1}`;
    if (!((s.quiz[id] ?? 0) >= 2)) return `/modul/${id}/kuis`;
  }
  return `/modul/${L.mods[0]}`;
}
export function certNo(L: Level, userId: string) {
  let h = 0; for (const c of userId + L.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return "DA-" + L.slug.slice(0, 3).toUpperCase() + "-" + h.toString(36).toUpperCase().slice(0, 6);
}
