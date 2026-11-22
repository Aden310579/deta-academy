/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Alamat lama /kelas/... dialihkan ke /level/...
  async redirects() { return [{ source: "/kelas/:slug", destination: "/level/:slug", permanent: true }]; },
};
export default nextConfig;
