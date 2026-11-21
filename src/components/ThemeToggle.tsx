"use client";
export default function ThemeToggle() {
  const flip = () => {
    const r = document.documentElement;
    const cur = r.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const nx = cur === "dark" ? "light" : "dark";
    r.setAttribute("data-theme", nx);
    try { localStorage.setItem("deta-theme", nx); } catch {}
    window.dispatchEvent(new Event("deta-theme"));
  };
  return (
    <button type="button" onClick={flip} aria-label="Ganti tema terang atau gelap">
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" style={{ display: "block" }}>
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
