import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getStudent, overall } from "@/lib/student";
import { Ticker, SearchButton } from "./Fx";
import { LEVELS, MODS, ORDER } from "@/content/curriculum";

const ITEMS = ORDER.flatMap((id) => {
  const m = MODS[id];
  return m.lessons.map((l, i) => ({ t: l.t, s: `Modul ${m.n} · ${m.title}`, k: l.b.replace(/<[^>]+>/g, " ").slice(0, 400), href: `/modul/${id}/${i + 1}` }))
    .concat([{ t: `Kuis Modul ${m.n}`, s: m.title, k: "", href: `/modul/${id}/kuis` }]);
}).concat(LEVELS.map((L) => ({ t: L.school, s: `${L.n} · ${L.name}`, k: "level kelas sertifikat lencana " + L.slug, href: `/level/${L.slug}` })))
  .concat([{ t: "Arena latihan: tebak arah", s: "Beranda", k: "latihan buy sell game", href: "/#arena" }]);

export default async function Header() {
  const s = await getStudent();
  const p = overall(s);
  return (
    <header className="bar">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="Deta Academy, beranda">
          <span className="logo-img" role="img" aria-label="Deta Academy, Level Up Your Trading" />
        </Link>
        <nav className="nav" aria-label="Menu utama">
          <Link href="/#kurikulum" className="hide-sm">Kurikulum</Link>
          <Link href="/harga" className="hide-sm">Harga</Link>
          {s.user ? (
            <Link href="/akun" className="pill" aria-label="Akun dan progres belajar">
              <span className="meter"><i style={{ width: p + "%" }} /></span>
              <span className="mono">{p}%</span>
              {s.isMember && <span className="chip go">PRO</span>}
            </Link>
          ) : (
            <Link href="/masuk" className="pill">Masuk</Link>
          )}
          <SearchButton items={ITEMS} />
          <ThemeToggle />
        </nav>
      </div>
      <Ticker />
    </header>
  );
}
