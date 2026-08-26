/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The placeholder kit/hero images shipped in /public are SVGs.
    // Next.js disables SVG optimization by default (XSS risk from
    // untrusted SVGs) — safe to allow here since these are our own
    // trusted, static, script-free files. If you swap in real photos
    // (.jpg/.png), this setting is simply unused.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
