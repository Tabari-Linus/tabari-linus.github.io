import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [open, setOpen] = useState(false);

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
    <header className="border-b border-rule dark:border-rule-dk sticky top-0 backdrop-blur bg-paper/85 dark:bg-paper-dk/85 z-40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-md bg-ink text-paper dark:bg-brass dark:text-ink flex items-center justify-center font-display italic text-lg leading-none pt-0.5">
            LT
          </span>
          <span className="hidden sm:inline font-body font-medium tracking-tight text-ink dark:text-ink-dk">
            Linus Tabari
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          <div className={`${open ? "flex" : "hidden sm:flex"} absolute sm:static top-full right-6 sm:right-auto mt-2 sm:mt-0 flex-col sm:flex-row gap-1 bg-paper dark:bg-paper-dk sm:bg-transparent p-2 sm:p-0 rounded-lg border border-rule dark:border-rule-dk sm:border-0 shadow-lg sm:shadow-none`}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brass-deep dark:text-brass"
                      : "text-ink-soft dark:text-ink-soft-dk hover:text-ink dark:hover:text-ink-dk"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            className="ml-1 w-9 h-9 rounded-md border border-rule dark:border-rule-dk hover:border-brass dark:hover:border-brass transition-colors flex items-center justify-center text-ink-soft dark:text-ink-soft-dk"
            aria-label="Toggle theme"
          >
            {dark ? "☾" : "☀"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden ml-1 w-9 h-9 rounded-md border border-rule dark:border-rule-dk flex items-center justify-center"
            aria-label="Menu"
          >
            ≡
          </button>
        </nav>
      </div>
    </header>
  );
}
