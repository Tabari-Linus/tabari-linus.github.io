import { Link } from "react-router-dom";
import { CONFIG } from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-32">
      <div className="container-narrow py-14">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10">
          <div>
            <p className="font-display text-2xl font-semibold text-body">
              Let's build something good.
            </p>
            <a
              href={`mailto:${CONFIG.socials.email}`}
              className="mt-3 inline-block font-mono text-mint hover:underline"
            >
              {CONFIG.socials.email}
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-mute mb-3">Pages</p>
            <ul className="space-y-2 text-soft text-sm">
              <li><Link to="/" className="hover:text-mint">Home</Link></li>
              <li><Link to="/projects" className="hover:text-mint">Work</Link></li>
              <li><Link to="/blog" className="hover:text-mint">Writing</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-mute mb-3">Elsewhere</p>
            <ul className="space-y-2 text-soft text-sm">
              <li><a className="hover:text-mint" href={CONFIG.socials.github}>GitHub ↗</a></li>
              <li><a className="hover:text-mint" href={CONFIG.socials.linkedin}>LinkedIn ↗</a></li>
              <li><a className="hover:text-mint" href={`mailto:${CONFIG.socials.email}`}>Email ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-wrap gap-4 items-center justify-between font-mono text-xs text-mute">
          <p>© {new Date().getFullYear()} {CONFIG.siteTitle} · {CONFIG.siteLocation}</p>
          <p>Built for your view</p>
        </div>
      </div>
    </footer>
  );
}
