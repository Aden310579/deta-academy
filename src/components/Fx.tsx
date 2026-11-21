"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { mountChart, mountTicker, mountDrill, mountPalette, mountSpotlight, mountReadBar } from "@/lib/fx";

export function Ticker() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => mountTicker(r.current), []);
  return <div className="ticker" ref={r} aria-label="Kata motivasi trading" />;
}

export function FxBoot() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => { const a = mountSpotlight(), b = mountReadBar(bar.current); return () => { a(); b(); }; }, []);
  return <div className="readbar" ref={bar} aria-hidden="true" />;
}

export function SearchButton({ items }: { items: { t: string; s: string; k?: string; href: string }[] }) {
  const router = useRouter();
  const pal = useRef<any>(null);
  useEffect(() => { pal.current = mountPalette(items, (h: string) => router.push(h)); return () => pal.current?.destroy(); }, [items, router]);
  return (
    <button className="kbd-btn" type="button" aria-label="Cari materi" onClick={() => pal.current?.open()}>
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" /></svg><kbd>Ctrl K</kbd>
    </button>
  );
}

export function ChartHero() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => mountChart(r.current), []);
  return (
    <div className="tape glass" ref={r}>
      <div className="tape-head">
        <div className="sym-wrap"><span className="sym">XAUUSD</span><span className="tfl" data-k="tf">M15</span><span className="sim">simulasi</span></div>
        <div className="seg" role="group" aria-label="Pilih timeframe">
          {["M15", "H1", "H4"].map((t, i) => <button key={t} type="button" data-tf={t} aria-pressed={i === 0 ? "true" : "false"}>{t}</button>)}
        </div>
      </div>
      <div className="ohlc mono">O <b data-k="o">—</b> H <b data-k="h">—</b> L <b data-k="l">—</b> C <b data-k="c">—</b> <span data-k="chg" /><span className="ema-key">— EMA 20</span></div>
      <canvas aria-label="Chart candlestick XAUUSD simulasi. Arahkan kursor untuk melihat harga." />
      <div className="trade"><a className="sell" href="#arena">SELL<b data-k="bid">—</b></a><div className="last">Harga<b data-k="px">—</b></div><a className="buy" href="#arena">BUY<b data-k="ask">—</b></a></div>
    </div>
  );
}

export function Arena() {
  const r = useRef<HTMLElement>(null);
  useEffect(() => mountDrill(r.current, { modHref: (id: string) => `/modul/${id}` }), []);
  return (
    <section className="arena glass" id="arena" ref={r}>
      <div className="arena-head">
        <div><div className="eyebrow">Arena latihan</div><h2>Tebak arah berikutnya</h2><p>Lihat chart, baca trennya, lalu pilih Buy atau Sell. 12 candle berikutnya akan terbuka. Latih insting membaca struktur tanpa risiko uang.</p></div>
        <div className="arena-stats"><div><span>Benar</span><b data-k="score">0</b></div><div><span>Akurasi</span><b data-k="acc">–</b></div><div><span>Streak</span><b data-k="streak">0</b></div><div><span>Rekor</span><b data-k="best">0</b></div></div>
      </div>
      <canvas aria-label="Chart latihan" />
      <p className="drill-msg" data-k="msg" />
      <div className="why" data-k="why" hidden />
      <div className="cta">
        <button className="btn sell-btn" type="button" data-pick="sell">▼ Sell</button>
        <button className="btn buy-btn" type="button" data-pick="buy">▲ Buy</button>
        <button className="btn primary" type="button" data-next hidden>Soal berikutnya →</button>
        <button className="btn ghost" type="button" data-reset>Reset skor</button>
      </div>
    </section>
  );
}
