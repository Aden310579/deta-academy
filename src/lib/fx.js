/* Deta Academy FX: chart interaktif, ticker, arena latihan, pencarian cepat.
   Vanilla JS supaya dipakai sama persis di preview HTML dan aplikasi Next.js. */

export function rng(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function genBars(seed, n, start, vol, drift) {
  const r = rng(seed); let px = start; const out = [];
  drift = drift || 0;
  for (let i = 0; i < n; i++) {
    const o = px, c = o + (r() - 0.5 + drift) * vol * 2.2;
    const h = Math.max(o, c) + r() * vol * 0.9, l = Math.min(o, c) - r() * vol * 0.9;
    out.push([o, h, l, c, 0.3 + r() * 0.7 + Math.abs(c - o) / vol * 0.4]);
    px = c;
  }
  return out;
}

export function ema(bars, p) {
  const k = 2 / (p + 1); let e = bars[0][3];
  return bars.map((b) => (e = b[3] * k + e * (1 - k)));
}

const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function setupCanvas(cv) {
  const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: r.width, H: r.height };
}

/* Gambar candle + EMA + volume + sumbu harga. Dipakai hero & arena. */
function paint(cv, bars, o) {
  o = o || {};
  const { ctx, W, H } = setupCanvas(cv);
  const axis = o.axis ? 58 : 0, volH = o.volume ? H * 0.16 : 0, top = 14, bottom = H - volH - 10;
  const slots = o.slots || bars.length, cw = (W - axis) / slots;
  const vis = bars.slice(0, slots);
  let hi = Math.max(...vis.map((b) => b[1])), lo = Math.min(...vis.map((b) => b[2]));
  if (o.range) { hi = Math.max(hi, o.range[1]); lo = Math.min(lo, o.range[0]); }
  const padR = (hi - lo) * 0.06; hi += padR; lo -= padR;
  const y = (v) => top + ((hi - v) / (hi - lo)) * (bottom - top);
  const inv = (py) => hi - ((py - top) / (bottom - top)) * (hi - lo);
  const line = css("--line"), muted = css("--muted"), bull = css("--bull"), bear = css("--bear"), acc = css("--accent");
  ctx.clearRect(0, 0, W, H);
  ctx.font = "11px JetBrains Mono, ui-monospace, monospace";
  ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.fillStyle = muted;
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4, py = Math.round(y(v)) + 0.5;
    ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W - axis, py); ctx.stroke(); ctx.globalAlpha = 1;
    if (axis) ctx.fillText(v.toFixed(o.dp ?? 2), W - axis + 6, py + 4);
  }
  (o.zones || []).forEach((z) => {
    const col = z.c === "bull" ? "--bull" : z.c === "bear" ? "--bear" : "--accent";
    ctx.fillStyle = css(col + "-soft"); ctx.fillRect(0, y(z.hi), W - axis, Math.max(2, y(z.lo) - y(z.hi)));
    if (z.label) { ctx.fillStyle = css(col); ctx.fillText(z.label, 6, Math.max(12, y(z.hi) - 4)); }
  });
  if (o.hiddenFrom !== undefined) {
    const x0 = o.hiddenFrom * cw;
    ctx.fillStyle = css("--accent-soft"); ctx.fillRect(x0, 0, W - axis - x0, H);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = acc; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, H); ctx.stroke(); ctx.setLineDash([]);
  }
  const maxV = Math.max(...vis.map((b) => b[4]));
  vis.forEach((b, i) => {
    if (o.show !== undefined && i >= o.show) return;
    const [op, h, l, c, v] = b, x = i * cw + cw / 2, col = c >= op ? bull : bear;
    if (volH) { ctx.globalAlpha = 0.35; ctx.fillStyle = col; const vh = (v / maxV) * (volH - 4); ctx.fillRect(x - cw * 0.32, H - vh, cw * 0.64, vh); ctx.globalAlpha = 1; }
    ctx.strokeStyle = col; ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(x, y(h)); ctx.lineTo(x, y(l)); ctx.stroke();
    const t = y(Math.max(op, c)); ctx.fillRect(x - cw * 0.32, t, cw * 0.64, Math.max(1.5, y(Math.min(op, c)) - t));
  });
  if (o.mark !== undefined && vis[o.mark]) {
    const b = vis[o.mark], x = o.mark * cw + cw / 2, cy = (y(b[1]) + y(b[2])) / 2, rad = Math.max(cw * 1.1, (y(b[2]) - y(b[1])) / 2 + 6);
    ctx.strokeStyle = css("--accent"); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, cy, cw * 1.2, rad, 0, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
  }
  if (o.ema) {
    const e = ema(bars, o.ema), n = o.show !== undefined ? o.show : vis.length;
    ctx.strokeStyle = acc; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = i * cw + cw / 2; i ? ctx.lineTo(x, y(e[i])) : ctx.moveTo(x, y(e[i])); }
    ctx.stroke(); ctx.lineWidth = 1;
  }
  if (o.lastLine) {
    const n = o.show !== undefined ? o.show : vis.length, last = vis[n - 1][3], py = y(last), up = last >= vis[n - 1][0];
    ctx.setLineDash([3, 3]); ctx.strokeStyle = up ? bull : bear; ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W - axis, py); ctx.stroke(); ctx.setLineDash([]);
    if (axis) { ctx.fillStyle = up ? bull : bear; ctx.fillRect(W - axis, py - 9, axis, 18); ctx.fillStyle = css("--bg"); ctx.fillText(last.toFixed(o.dp ?? 2), W - axis + 6, py + 4); }
  }
  if (o.cross && o.cross.i >= 0 && o.cross.i < vis.length) {
    const x = o.cross.i * cw + cw / 2;
    ctx.setLineDash([2, 4]); ctx.strokeStyle = muted;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, o.cross.y); ctx.lineTo(W - axis, o.cross.y); ctx.stroke(); ctx.setLineDash([]);
    if (axis && o.cross.y > top && o.cross.y < bottom) { ctx.fillStyle = css("--fg"); ctx.fillRect(W - axis, o.cross.y - 9, axis, 18); ctx.fillStyle = css("--bg"); ctx.fillText(inv(o.cross.y).toFixed(o.dp ?? 2), W - axis + 6, o.cross.y + 4); }
  }
  return { cw };
}

/* ---------- Chart hero ---------- */
export function mountChart(root) {
  const cv = root.querySelector("canvas");
  const TF = { M15: { seed: 7, vol: 1.5 }, H1: { seed: 23, vol: 3.2 }, H4: { seed: 51, vol: 6.5 } };
  let tf = "M15", bars = [], cross = null, cw = 10, timer, r = rng(99);
  const q = (k) => root.querySelector(`[data-k="${k}"]`);
  const load = () => { const c = TF[tf]; bars = genBars(c.seed, 160, 2651.2, c.vol, 0.02); };
  const slots = () => Math.max(24, Math.min(bars.length, Math.floor((cv.clientWidth - 58) / 9)));
  const readout = (i) => {
    const s = bars.slice(-slots()); const b = s[i] || s[s.length - 1]; const prev = s[i >= 0 ? i - 1 : s.length - 2] || b;
    const ch = b[3] - prev[3];
    q("o").textContent = b[0].toFixed(2); q("h").textContent = b[1].toFixed(2); q("l").textContent = b[2].toFixed(2); q("c").textContent = b[3].toFixed(2);
    const e = q("chg"); e.textContent = (ch >= 0 ? "+" : "") + ch.toFixed(2) + " (" + ((ch / prev[3]) * 100).toFixed(2) + "%)"; e.style.color = ch >= 0 ? "var(--bull)" : "var(--bear)";
    const last = bars[bars.length - 1][3]; q("px").textContent = last.toFixed(2);
    const sp = { M15: 0.18, H1: 0.18, H4: 0.18 }[tf];
    q("bid").textContent = last.toFixed(2); q("ask").textContent = (last + sp).toFixed(2);
  };
  const draw = () => {
    const s = bars.slice(-slots());
    cw = paint(cv, s, { axis: true, volume: true, ema: 20, lastLine: true, cross }).cw;
    readout(cross ? cross.i : -1);
  };
  const tick = () => {
    const b = bars[bars.length - 1], c = TF[tf];
    b[3] += (r() - 0.49) * c.vol * 0.35; b[1] = Math.max(b[1], b[3]); b[2] = Math.min(b[2], b[3]); b[4] += r() * 0.05;
    if (r() < 0.1) { const o = b[3]; bars.push([o, o, o, o, 0.2]); bars.shift(); }
    draw();
    const p = q("px"); p.classList.remove("up", "dn"); void p.offsetWidth; p.classList.add(b[3] >= b[0] ? "up" : "dn");
  };
  root.querySelectorAll("[data-tf]").forEach((btn) => btn.addEventListener("click", () => {
    tf = btn.dataset.tf; root.querySelectorAll("[data-tf]").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
    q("tf").textContent = tf; load(); draw();
  }));
  const move = (e) => { const rc = cv.getBoundingClientRect(); const i = Math.floor((e.clientX - rc.left) / cw); cross = { i, y: e.clientY - rc.top }; draw(); };
  cv.addEventListener("pointermove", move); cv.addEventListener("pointerdown", move);
  cv.addEventListener("pointerleave", () => { cross = null; draw(); });
  const onResize = () => draw();
  window.addEventListener("resize", onResize); window.addEventListener("deta-theme", onResize);
  load(); draw();
  if (!reduced()) timer = setInterval(tick, 650);
  return () => { clearInterval(timer); window.removeEventListener("resize", onResize); window.removeEventListener("deta-theme", onResize); };
}

/* ---------- Ticker kata motivasi ---------- */
const QUOTES = [
  "Lindungi modal dulu, profit akan menyusul.",
  "Tidak ada setup berarti tidak ada trade.",
  "Rugi kecil itu biaya usaha, rugi besar itu kesalahan.",
  "Disiplin hari ini, konsisten tahun depan.",
  "Pasar selalu memberi peluang lagi. Jangan kejar yang sudah lari.",
  "Ikuti rencana, bukan perasaan.",
  "Satu trade tidak menentukan apa-apa. Seratus trade menentukan segalanya.",
  "Sabar menunggu harga datang ke zonamu.",
  "Stop loss adalah sabuk pengaman, bukan musuh.",
  "Jurnal hari ini adalah guru terbaikmu besok.",
  "Trader hebat tidak selalu benar, tapi selalu terkendali.",
  "Belajar dulu, latihan di demo, baru pakai uang asli.",
];
export function mountTicker(root) {
  const mark = `<svg class="tk-mark" width="10" height="14" viewBox="0 0 10 14" aria-hidden="true"><line x1="5" y1="0" x2="5" y2="14" stroke="currentColor" stroke-width="1.4"/><rect x="2" y="3" width="6" height="8" rx="1" fill="currentColor"/></svg>`;
  const row = QUOTES.map((q) => `<span class="tk">${mark}<span>${q}</span></span>`).join("");
  root.innerHTML = `<div class="tk-track">${row}${row}</div>`;
  return () => {};
}

/* ---------- Arena latihan: tebak arah ---------- */
/* Setiap soal dibuat dari setup yang punya alasan jelas, lalu dijelaskan setelah candle terbuka. */
const VIS = 44, HID = 12;
function builder(seed, start, vol) {
  const r = rng(seed); const bars = []; let px = start;
  const add = (o, c, wu, wd, v) => { bars.push([o, Math.max(o, c) + wu, Math.min(o, c) - wd, c, v || 0.3 + r() * 0.7]); px = c; };
  const B = {
    bars, get px() { return px; },
    run(n, drift, k) { k = k || 1; for (let i = 0; i < n; i++) { const o = px, c = o + ((r() - 0.5) * 2 + drift) * vol * k; add(o, c, r() * vol * 0.7 * k, r() * vol * 0.7 * k); } return B; },
    to(target, n, k) { k = k || 1; for (let i = 0; i < n; i++) { const o = px, c = o + (target - o) / (n - i) + (r() - 0.5) * vol * 0.9 * k; add(o, c, r() * vol * 0.6 * k, r() * vol * 0.6 * k); } return B; },
    pad(n) { while (bars.length < n) B.run(1, 0, 0.4); bars.length = Math.min(bars.length, n); px = bars[bars.length - 1][3]; return B; },
    pin(d) { const o = px, c = o + d * vol * 0.35; add(o, c, d > 0 ? vol * 0.15 : vol * 2.8, d > 0 ? vol * 2.8 : vol * 0.15, 1.3); return B; },
    engulf(d) { const o = px, c = o + d * vol * 2.6; add(o, c, vol * 0.2, vol * 0.2, 1.5); return B; },
    big(d) { const o = px, c = o + d * vol * 3.2; add(o, c, vol * 0.25, vol * 0.25, 1.8); return B; },
  };
  return B;
}

export function genScenario(seed) {
  const r0 = rng(seed * 7 + 3); r0();
  const d = r0() < 0.5 ? 1 : -1, roll = r0(), up = d > 0;
  const type = roll < 0.27 ? "trend" : roll < 0.5 ? "range" : roll < 0.7 ? "breakout" : roll < 0.87 ? "reversal" : "gagal";
  const vol = 1.6, b = builder(seed, 2650, vol);
  const NAIK = up ? "naik" : "turun", LAWAN = up ? "turun" : "naik";
  let zones = [], reasons = [], mod, title;
  if (type === "trend" || type === "gagal") {
    b.run(28, 0.5 * d).run(15, -0.32 * d).pad(VIS - 1).engulf(d);
    if (type === "trend") b.run(HID, 0.55 * d); else b.run(2, -0.2 * d).run(HID - 2, -0.6 * d);
    title = type === "trend" ? "Tren berlanjut setelah koreksi" : "Setup tren yang gagal";
    reasons = [
      `Tren besar ${NAIK}: ${up ? "puncak dan lembah makin tinggi" : "puncak dan lembah makin rendah"}, dan harga berada ${up ? "di atas" : "di bawah"} EMA 20.`,
      `Harga koreksi ${LAWAN} ke sekitar EMA 20, yang sering menjadi ${up ? "support" : "resistance"} dinamis saat tren berjalan.`,
      `Candle terakhir ${up ? "bullish" : "bearish"} engulfing (dilingkari): ${up ? "pembeli" : "penjual"} mengambil alih setelah koreksi.`,
    ];
    if (type === "gagal") reasons.push(`Kali ini setupnya gagal: harga menembus ${up ? "low" : "high"} candle sinyal lalu berbalik. Tidak ada setup yang selalu berhasil. Karena itu stop loss wajib dipasang di balik candle sinyal, supaya ruginya kecil.`);
    mod = type === "trend" ? { id: "m3", name: "Modul 3: Candlestick" } : { id: "m8", name: "Modul 8: Manajemen Risiko" };
  } else if (type === "range") {
    const lo = 2644, hi = 2656;
    b.to(hi, 9, 0.6).to(lo, 10, 0.6).to(hi, 10, 0.6).to(up ? lo : hi, 13, 0.6).pad(VIS - 1).pin(d).run(HID, 0.42 * d, 0.8);
    zones = up ? [{ lo: lo - 1.4, hi: lo + 1, c: "bull", label: "SUPPORT" }, { lo: hi - 1, hi: hi + 1.4, c: "bear", label: "RESISTANCE" }]
               : [{ lo: hi - 1, hi: hi + 1.4, c: "bear", label: "RESISTANCE" }, { lo: lo - 1.4, hi: lo + 1, c: "bull", label: "SUPPORT" }];
    title = up ? "Pantulan dari support" : "Penolakan dari resistance";
    reasons = [
      `Pasar sedang sideways: harga berputar di antara support sekitar ${lo} dan resistance sekitar ${hi}.`,
      `Harga kembali ke zona ${up ? "support" : "resistance"} yang sudah dua kali menahan harga.`,
      `Candle terakhir ${up ? "pin bar dengan ekor bawah panjang" : "shooting star dengan ekor atas panjang"} (dilingkari): penolakan kuat dari zona itu.`,
      `Saat pasar sideways, petunjuk EMA kurang bisa diandalkan. Zona support dan resistance lebih penting.`,
    ];
    mod = { id: "m4", name: "Modul 4: Support & Resistance" };
  } else if (type === "breakout") {
    b.run(20, 0.45 * d).run(VIS - 20, 0, 0.3).pad(VIS);
    const box = b.bars.slice(20, VIS), bh = Math.max(...box.map((x) => x[1])), bl = Math.min(...box.map((x) => x[2]));
    b.big(d).run(HID - 1, 0.5 * d);
    zones = [{ lo: bl, hi: bh, c: "accent", label: "KONSOLIDASI" }];
    title = "Breakout searah tren";
    reasons = [
      `Sebelumnya harga ${NAIK} kuat.`,
      `Lalu harga menyempit dalam range kecil (konsolidasi). Ini jeda istirahat, mirip pola flag atau pennant.`,
      `Pola lanjutan biasanya pecah searah tren sebelumnya. Candle besar menembus batas ${up ? "atas" : "bawah"} konsolidasi dan harga melanjutkan arahnya.`,
    ];
    mod = { id: "m5", name: "Modul 5: Trendline & Chart Pattern" };
  } else {
    b.run(28, 0.5 * d); const peak = b.px + d * vol * 1.5;
    b.to(peak, 4).to(peak - d * vol * 4, 5).to(peak, 5).pad(VIS - 1).pin(-d).run(HID, -0.55 * d);
    zones = [{ lo: up ? peak - 1 : peak - 1.6, hi: up ? peak + 1.6 : peak + 1, c: up ? "bear" : "bull", label: up ? "DOUBLE TOP" : "DOUBLE BOTTOM" }];
    title = up ? "Pembalikan: double top" : "Pembalikan: double bottom";
    reasons = [
      `Tren ${NAIK} mulai kehabisan tenaga: harga gagal membuat ${up ? "puncak yang lebih tinggi" : "lembah yang lebih rendah"}.`,
      `Dua ${up ? "puncak" : "lembah"} di level yang hampir sama membentuk ${up ? "double top" : "double bottom"}.`,
      `Candle terakhir ${up ? "shooting star" : "pin bar"} (dilingkari): penolakan kuat di level itu.`,
      `EMA 20 masih ${NAIK} karena EMA bergerak lambat. Struktur harga memberi tanda pembalikan lebih dulu.`,
    ];
    mod = { id: "m5", name: "Modul 5: Trendline & Chart Pattern" };
  }
  return { bars: b.bars.slice(0, VIS + HID), type, title, reasons, zones, mod, signal: VIS - 1, answer: type === "reversal" || type === "gagal" ? -d : d };
}

export function mountDrill(root, opts) {
  opts = opts || {};
  const modHref = opts.modHref || ((id) => "#" + id);
  const cv = root.querySelector("canvas"), msg = root.querySelector("[data-k=msg]");
  let why = root.querySelector("[data-k=why]");
  if (!why) { why = document.createElement("div"); why.setAttribute("data-k", "why"); msg.after(why); }
  why.className = "why"; why.hidden = true;
  const KEY = "deta-drill";
  let S = { score: 0, played: 0, streak: 0, best: 0 };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  let sc, show = VIS, busy = false, revealed = false, roundSeed = Math.floor(Math.random() * 1e6) + 1, anim;
  const stat = () => {
    root.querySelector("[data-k=score]").textContent = S.score;
    root.querySelector("[data-k=acc]").textContent = S.played ? Math.round((S.score / S.played) * 100) + "%" : "–";
    root.querySelector("[data-k=streak]").textContent = S.streak;
    root.querySelector("[data-k=best]").textContent = S.best;
  };
  const draw = () => paint(cv, sc.bars, { slots: VIS + HID, show, ema: 20, hiddenFrom: show < VIS + HID ? VIS : undefined, lastLine: true, zones: revealed ? sc.zones : [], mark: revealed ? sc.signal : undefined });
  const btns = () => root.querySelectorAll("[data-pick]");
  const round = () => {
    do { roundSeed = (roundSeed * 7 + 13) % 999983 || 1; sc = genScenario(roundSeed); }
    while (Math.sign(sc.bars[VIS + HID - 1][3] - sc.bars[VIS - 1][3]) !== sc.answer);
    show = VIS; busy = false; revealed = false; why.hidden = true; draw();
    const e = ema(sc.bars, 20), trend = e[VIS - 1] > e[VIS - 11] ? "naik" : "turun";
    msg.innerHTML = `Petunjuk: EMA 20 sedang <b>${trend}</b>. Perhatikan juga candle terakhir dan di area mana harga berada. Ke mana harga bergerak dalam ${HID} candle berikutnya?`;
    msg.className = "drill-msg";
    btns().forEach((b) => (b.disabled = false));
    root.querySelector("[data-next]").hidden = true;
  };
  const pick = (dir) => {
    if (busy) return; busy = true; btns().forEach((b) => (b.disabled = true));
    const entry = sc.bars[VIS - 1][3];
    const finish = () => {
      revealed = true; draw();
      const exit = sc.bars[VIS + HID - 1][3], move = exit - entry, win = (dir === "buy" && move > 0) || (dir === "sell" && move < 0);
      S.played++; if (win) { S.score++; S.streak++; S.best = Math.max(S.best, S.streak); } else S.streak = 0;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      stat();
      const pips = Math.abs(move * 10).toFixed(0), arah = move > 0 ? "naik" : "turun";
      msg.className = "drill-msg " + (win ? "win" : "lose");
      msg.innerHTML = win ? `Tepat! Harga ${arah} ${pips} pip, searah posisimu.` : `Belum tepat. Harga ${arah} ${pips} pip, berlawanan dengan posisimu.`;
      why.innerHTML = `<div class="why-head"><span class="eyebrow">Kenapa harga ${arah}?</span><b>${sc.title}</b></div><ol>${sc.reasons.map((t) => `<li>${t}</li>`).join("")}</ol><a class="why-link" href="${modHref(sc.mod.id)}">Pelajari lagi di ${sc.mod.name} →</a>`;
      why.hidden = false;
      root.querySelector("[data-next]").hidden = false;
    };
    if (reduced()) { show = VIS + HID; finish(); return; }
    anim = setInterval(() => { show++; draw(); if (show >= VIS + HID) { clearInterval(anim); finish(); } }, 110);
  };
  btns().forEach((b) => b.addEventListener("click", () => pick(b.dataset.pick)));
  root.querySelector("[data-next]").addEventListener("click", round);
  root.querySelector("[data-reset]").addEventListener("click", () => { S = { score: 0, played: 0, streak: 0, best: 0 }; try { localStorage.removeItem(KEY); } catch (e) {} stat(); });
  const onResize = () => draw();
  window.addEventListener("resize", onResize); window.addEventListener("deta-theme", onResize);
  stat(); round();
  return () => { clearInterval(anim); window.removeEventListener("resize", onResize); window.removeEventListener("deta-theme", onResize); };
}

/* ---------- Pencarian cepat (Ctrl+K) ---------- */
export function mountPalette(items, go) {
  let el = document.getElementById("pal");
  if (!el) {
    el = document.createElement("div"); el.id = "pal"; el.hidden = true;
    el.innerHTML = `<div class="pal-box" role="dialog" aria-modal="true" aria-label="Cari materi"><div class="pal-in"><svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="2"/></svg><input id="palQ" type="text" placeholder="Cari materi: pin bar, lot, RSI..." autocomplete="off"><kbd>Esc</kbd></div><ul class="pal-list" id="palL" role="listbox"></ul></div>`;
    document.body.appendChild(el);
  }
  const qi = el.querySelector("#palQ"), list = el.querySelector("#palL");
  let sel = 0, res = items;
  const render = () => {
    const t = qi.value.trim().toLowerCase();
    res = (t ? items.filter((x) => (x.t + " " + x.s + " " + (x.k || "")).toLowerCase().includes(t)).map((x) => [x.t.toLowerCase().includes(t) ? 0 : x.s.toLowerCase().includes(t) ? 1 : 2, x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]) : items).slice(0, 9);
    sel = Math.min(sel, Math.max(0, res.length - 1));
    list.innerHTML = res.length ? res.map((x, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}"><span class="pal-t">${x.t}</span><span class="pal-s">${x.s}</span></li>`).join("") : `<li class="pal-empty">Tidak ada materi yang cocok dengan "${qi.value.replace(/</g, "&lt;")}".</li>`;
  };
  const open = () => { el.hidden = false; qi.value = ""; sel = 0; render(); setTimeout(() => qi.focus(), 0); };
  const close = () => { el.hidden = true; };
  const choose = (i) => { const x = res[i]; if (!x) return; close(); go(x.href); };
  qi.oninput = () => { sel = 0; render(); };
  qi.onkeydown = (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(res.length - 1, sel + 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    else if (e.key === "Enter") choose(sel);
    else if (e.key === "Escape") close();
  };
  list.onclick = (e) => { const li = e.target.closest("[data-i]"); if (li) choose(+li.dataset.i); };
  el.onclick = (e) => { if (e.target === el) close(); };
  const key = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); el.hidden ? open() : close(); } };
  window.addEventListener("keydown", key);
  return { open, close, destroy: () => window.removeEventListener("keydown", key) };
}

/* ---------- Efek sorot kartu & progres baca ---------- */
export function mountSpotlight() {
  const f = (e) => { const c = e.target.closest && e.target.closest(".mod,.glass-hover,.tier"); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); };
  document.addEventListener("pointermove", f);
  return () => document.removeEventListener("pointermove", f);
}
export function mountReadBar(bar) {
  const f = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  addEventListener("scroll", f, { passive: true }); f();
  return () => removeEventListener("scroll", f);
}
