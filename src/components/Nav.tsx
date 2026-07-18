import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { CONFIG } from "../config";

export default function Nav() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/projects", label: "Work" },
    { to: "/blog", label: "Writing" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-base/85 backdrop-blur border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-md bg-mint text-black grid place-items-center font-display font-bold text-sm">
            LT
          </span>
          <span className="font-display font-semibold text-body tracking-tight">
            {CONFIG.siteTitle.split(" ")[0]}
          </span>
          <span className="text-mute font-mono text-sm">·</span>
          <span className="hidden sm:inline text-soft text-sm">{CONFIG.siteRole}</span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-3">
          <div
            className={`${open ? "flex" : "hidden sm:flex"} absolute sm:static top-full right-4 sm:right-auto mt-2 sm:mt-0 flex-col sm:flex-row gap-1 bg-surface sm:bg-transparent p-2 sm:p-0 rounded-lg border border-line sm:border-0 shadow-xl sm:shadow-none min-w-40 sm:min-w-0`}
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors font-mono ${
                    isActive ? "text-mint" : "text-soft hover:text-body"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={CONFIG.socials.github}
              target="_blank"
              rel="noreferrer"
              className="sm:hidden px-3 py-1.5 text-sm text-soft hover:text-body font-mono"
            >
              GitHub ↗
            </a>
          </div>

          <a
            href={CONFIG.socials.github}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm text-soft hover:text-body font-mono transition-colors"
          >
            GitHub ↗
          </a>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md border border-line hover:border-mint text-soft hover:text-mint transition-colors grid place-items-center"
            aria-label="Toggle theme"
          >
            {dark ? "☾" : "☀"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden w-9 h-9 rounded-md border border-line grid place-items-center text-soft"
            aria-label="Menu"
          >
            ≡
          </button>
        </nav>
      </div>
    </header>
  );
}
