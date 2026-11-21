import { MODS } from "@/content/curriculum";
export const QUIZ_N = 3;

function seeded(seed: number) {
  let s = (seed % 2147483646) + 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const shuffle = <T,>(a: T[], r: () => number) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Cookie per modul: "<soal percobaan terakhir dipisah titik>~<seed>".
 *  Pilihan soal tetap sama selama seed sama, jadi hasil tidak hilang saat halaman dimuat ulang. */
export function parseQuizCookie(v?: string) {
  const [ids = "", seed = "0"] = (v || "").split("~");
  return { seen: ids.split(".").filter(Boolean).map(Number).filter(Number.isInteger), seed: parseInt(seed, 10) || 0 };
}

/** 3 soal dari bank modul; soal percobaan terakhir dipakai paling akhir. Urutan pilihan diacak. */
export function pickQuiz(modId: string, cookieVal?: string) {
  const bank = MODS[modId].quiz, { seen, seed } = parseQuizCookie(cookieVal), r = seeded(seed * 31 + modId.length);
  const seenSet = new Set(seen);
  const fresh = shuffle(bank.map((_, i) => i).filter((i) => !seenSet.has(i)), r);
  const old = shuffle(seen.filter((i) => bank[i]), r);
  return fresh.concat(old).slice(0, QUIZ_N).map((qi) => ({ qi, q: bank[qi].q, o: shuffle(bank[qi].o.map((t, i) => ({ i, t })), r) }));
}
