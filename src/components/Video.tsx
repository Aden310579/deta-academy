/** Menerima link YouTube (watch, youtu.be, shorts) atau Vimeo, lalu menampilkannya sebagai pemutar. */
function toEmbed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}
export default function Video({ url, title }: { url: string; title: string }) {
  return (
    <div className="video"><iframe src={toEmbed(url)} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>
  );
}
