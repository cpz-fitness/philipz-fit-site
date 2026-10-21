/* ==========================================================================
   FOOTER — CPZ Fitness (new ICA rebrand)
   Dark footer: logo + rainbow "seen" tagline, nav links, social squares
   ========================================================================== */

import CpzLogo from "./CpzLogo";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "The Program", href: "/#process" },
  { label: "TDEE Calculator", href: "/tdee" },
  { label: "Free Consultation", href: "/#book" },
];

const socials = [
  { icon: "IG", title: "@philipz.fit on Instagram", href: "https://www.instagram.com/philipz.fit/" },
  { icon: "TT", title: "@philipz.fit on TikTok", href: "https://www.tiktok.com/@philipz.fit" },
  { icon: "FB", title: "@philipz.fit on Facebook", href: "https://www.facebook.com/philipz.fit" },
  { icon: "TH", title: "@philipz.fit on Threads", href: "https://www.threads.net/@philipz.fit" },
  { icon: "BS", title: "@philipz.fit on Bluesky", href: "https://bsky.app/profile/philipz.fit" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0d0e10", borderTop: "1px solid rgba(255,140,0,0.12)", padding: "3rem 0 2rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Logo + wordmark + tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <CpzLogo size={28} />
            <div>
              <div
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#eceef0",
                  whiteSpace: "nowrap",
                }}
              >
                CPZ Fitness
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", color: "#aeb2b8" }}>
                Lifting to be{" "}
                <span className="rainbow-text" style={{ fontWeight: 600, textTransform: "uppercase" }}>
                  seen
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: "#aeb2b8",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {socials.map((soc) => (
              <a
                key={soc.icon}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                title={soc.title}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,140,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "#aeb2b8",
                  textDecoration: "none",
                }}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(255,140,0,0.08)", marginBottom: "1.5rem" }} />

        {/* Bottom row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6a6d72", margin: 0 }}>
            © 2026 CPZ Fitness. All rights reserved.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6a6d72", margin: 0 }}>
            He was in there the whole time.
          </p>
        </div>
      </div>
    </footer>
  );
}
