import { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate, Link } from "react-router-dom";
import { auth, verifyToken } from "../../lib/github";
import NewPost from "./NewPost";
import NewProject from "./NewProject";
import ContentList from "./ContentList";

export default function Admin() {
  const [status, setStatus] = useState<"checking" | "signed-out" | "signed-in">("checking");
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    if (!auth.token) { setStatus("signed-out"); return; }
    verifyToken()
      .then(({ login, canPush }) => {
        if (!canPush) { setStatus("signed-out"); auth.clear(); }
        else { setUser(login); setStatus("signed-in"); }
      })
      .catch(() => { auth.clear(); setStatus("signed-out"); });
  }, []);

  if (status === "checking")
    return <div className="container-narrow py-24 text-soft">Checking access…</div>;

  if (status === "signed-out") return <SignIn onDone={() => window.location.reload()} />;

  return (
    <div className="container-narrow py-16">
      <header className="mb-10 pb-8 border-b border-line flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Studio</p>
          <h1 className="font-display text-4xl font-bold text-body tracking-tight">Publishing desk</h1>
          <p className="text-sm text-mute mt-2 font-mono">
            $ signed_in_as: <span className="text-mint">{user}</span>
          </p>
        </div>
        <button
          onClick={() => { auth.clear(); window.location.reload(); }}
          className="btn-secondary text-sm"
        >
          Sign out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2 mb-10">
        {[
          { to: "/admin/new-post", label: "New post" },
          { to: "/admin/new-project", label: "New project" },
          { to: "/admin/content", label: "Existing content" },
        ].map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-mono transition-colors border ${
                isActive
                  ? "bg-mint text-black border-mint"
                  : "border-line text-soft hover:border-mint hover:text-mint"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route index element={<Navigate to="new-post" replace />} />
        <Route path="new-post" element={<NewPost />} />
        <Route path="new-project" element={<NewProject />} />
        <Route path="content" element={<ContentList />} />
      </Routes>
    </div>
  );
}

function SignIn({ onDone }: { onDone: () => void }) {
  const [pat, setPat] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    auth.token = pat.trim();
    try {
      const { canPush } = await verifyToken();
      if (!canPush) throw new Error("Token doesn't have write access to this repo.");
      onDone();
    } catch (err: any) {
      auth.clear();
      setError(err.message ?? "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-narrow py-20 max-w-md">
      <p className="eyebrow mb-4">Studio · Sign in</p>
      <h1 className="font-display text-4xl font-bold text-body mb-4 tracking-tight">Welcome back.</h1>
      <p className="text-soft mb-8 leading-relaxed">
        Paste a GitHub Personal Access Token with{" "}
        <code className="text-mint font-mono">contents:write</code> and{" "}
        <code className="text-mint font-mono">issues:write</code> on this repo. Stored only in your browser's
        localStorage and sent directly to github.com.
      </p>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-mono text-mute uppercase tracking-wider mb-2">
            Personal access token
          </label>
          <input
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="github_pat_…"
            className="w-full px-4 py-3 rounded-md border border-line bg-surface font-mono text-sm focus:border-mint outline-none transition-colors text-body"
            autoComplete="off"
            required
          />
        </div>
        {error && (
          <div className="p-3 rounded-md border border-red-500/50 bg-red-500/10">
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={busy || !pat}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {busy ? "Verifying…" : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-xs text-mute">
        Need a token?{" "}
        <a
          href="https://github.com/settings/personal-access-tokens"
          className="text-mint underline"
        >
          Create a fine-grained PAT
        </a>{" "}
        with access to just this repo. Scopes: Contents (RW), Issues (RW), Metadata (R).
      </p>
      <Link to="/" className="mt-10 block text-center text-sm text-mute hover:text-mint font-mono">
        ← Back to site
      </Link>
    </div>
  );
}
