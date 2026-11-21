import "./globals.css";
import "./fx.css";
import { FxBoot } from "@/components/Fx";
import Header from "@/components/Header";

export const metadata = {
  title: "Deta Academy · Sekolah trading dari nol sampai bisa",
  description: "Belajar trading forex, emas, dan kripto bertahap: 10 modul, kuis, dan progres belajar.",
};
export const dynamic = "force-dynamic";
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const themeInit = `try{var t=localStorage.getItem('deta-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" />
      </head>
      <body>
        <Header />
        <FxBoot />
        <main>{children}</main>
        <footer>
          <div className="wrap">
            <div><b style={{ color: "var(--fg)" }}>Deta Academy</b> · Sekolah trading dari nol sampai bisa, bagian dari DETA Expert.com.</div>
            <div>Materi ini untuk edukasi, bukan ajakan atau saran investasi. Trading forex, emas, dan kripto berisiko tinggi dan bisa menghabiskan modal. Gunakan uang yang siap hilang dan selalu latihan di akun demo dulu.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
