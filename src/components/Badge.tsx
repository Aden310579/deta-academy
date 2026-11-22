import type { Level } from "@/content/curriculum";
import { LEVELS } from "@/content/curriculum";

/** Lencana segi enam per level; jumlah candle = nomor level. */
export default function Badge({ L, size, earned, className = "" }: { L: Level; size: number; earned: boolean; className?: string }) {
  const i = LEVELS.indexOf(L) + 1;
  const bars = Array.from({ length: i }, (_, k) => {
    const x = 50 - (i - 1) * 9 + k * 18, h = 16 + k * 7;
    return (
      <g key={k}>
        <line x1={x} x2={x} y1={60 - h - 6} y2={64} stroke="#fff" strokeWidth="2" opacity=".85" />
        <rect x={x - 5} y={60 - h} width="10" height={h} rx="2" fill="#fff" />
      </g>
    );
  });
  return (
    <svg className={"badge" + (earned ? "" : " off") + (className ? " " + className : "")} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Lencana ${L.school}${earned ? "" : ", belum diraih"}`}>
      <defs><linearGradient id={`bg${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={L.c1} /><stop offset="1" stopColor={L.c2} /></linearGradient></defs>
      <path d="M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5Z" fill={`url(#bg${i})`} />
      <path d="M50 11 L84 30.5 L84 69.5 L50 89 L16 69.5 L16 30.5Z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
      <g transform="translate(0 6)">{bars}</g>
    </svg>
  );
}
