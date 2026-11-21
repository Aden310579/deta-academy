"use client";
import { useState } from "react";
export default function LotCalculator() {
  const [bal, setBal] = useState(1000), [risk, setRisk] = useState(1), [sl, setSl] = useState(25), [pv, setPv] = useState(10);
  const money = (bal * risk) / 100;
  const lot = sl > 0 ? money / (sl * pv) : 0;
  return (
    <div className="calc">
      <h4>Kalkulator ukuran lot</h4>
      <label htmlFor="cBal">Saldo akun ($)<input id="cBal" type="number" min={0} step={10} value={bal} onChange={(e) => setBal(+e.target.value)} /></label>
      <label htmlFor="cRisk">Risiko per trade (%)<input id="cRisk" type="number" min={0.1} max={10} step={0.1} value={risk} onChange={(e) => setRisk(+e.target.value)} /></label>
      <label htmlFor="cSl">Stop loss (pip)<input id="cSl" type="number" min={1} step={1} value={sl} onChange={(e) => setSl(+e.target.value)} /></label>
      <label htmlFor="cIns">Instrumen
        <select id="cIns" value={pv} onChange={(e) => setPv(+e.target.value)}>
          <option value={10}>EURUSD / GBPUSD / XAUUSD ($10 per pip per lot)</option>
          <option value={6.5}>USDJPY (±$6.5 per pip per lot)</option>
        </select>
      </label>
      <div className="out">
        <div className="main"><span>Ukuran lot</span><b>{(Math.floor(lot * 100) / 100).toFixed(2)}</b></div>
        <div><span>Uang yang dipertaruhkan</span><b>${money.toFixed(2)}</b></div>
        <div><span>Target 2R</span><b>+${(money * 2).toFixed(2)}</b></div>
      </div>
    </div>
  );
}
