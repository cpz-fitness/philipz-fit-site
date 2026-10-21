/* ==========================================================================
   NAVBAR — CPZ Fitness (new ICA rebrand)
   Fixed 72px nav: logo + wordmark, About / The Program links, orange
   Free Consultation pill. JS-driven breakpoint at 900px (not CSS media
   queries), scrolled state past 40px.
   ========================================================================== */

import { useState, useEffect } from "react";
import CpzLogo from "./CpzLogo";

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowWidth;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isDesktopNav = windowWidth >= 900;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "#aeb2b8",
    textDecoration: "none",
  };

  const primaryStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    background: "#ff8c00",
    color: "#121316",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    padding: "0.6rem 1.4rem",
    borderRadius: "14px",
    textDecoration: "none",
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(18,19,22,0.97)" : "rgba(18,19,22,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(255,140,0,0.18)" : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo — ZF mark inline SVG + wordmark */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <CpzLogo size={34} />
          <span
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "0.04em",
              color: "#eceef0",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            CPZ Fitness
          </span>
        </a>

        {isDesktopNav ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span title="Proudly serving the gay community" style={{ fontSize: "1.3rem", lineHeight: 1 }}>
              🏳️‍🌈
            </span>
            <a href="/#about" style={linkStyle}>
              About
            </a>
            <a href="/#process" style={linkStyle}>
              The Program
            </a>
            <a href="/tdee" style={linkStyle}>
              TDEE Calculator
            </a>
            <a href="/#book" style={primaryStyle}>
              Free Consultation
            </a>
          </div>
        ) : (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "0.5rem",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "#eceef0" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "#eceef0" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "#eceef0" }} />
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {!isDesktopNav && menuOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(255,140,0,0.15)",
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            background: "#121316",
          }}
        >
          <a
            href="/#about"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, fontSize: "1.05rem", color: "#eceef0" }}
          >
            About
          </a>
          <a
            href="/#process"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, fontSize: "1.05rem", color: "#eceef0" }}
          >
            The Program
          </a>
          <a
            href="/tdee"
            onClick={() => setMenuOpen(false)}
            style={{ ...linkStyle, fontSize: "1.05rem", color: "#eceef0" }}
          >
            TDEE Calculator
          </a>
          <a
            href="/#book"
            onClick={() => setMenuOpen(false)}
            style={{ ...primaryStyle, justifyContent: "center", fontSize: "1rem", padding: "0.75rem 1.4rem" }}
          >
            Free Consultation
          </a>
        </div>
      )}
    </nav>
  );
}
