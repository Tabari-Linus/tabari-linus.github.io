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
        if (!canPush) {
          setStatus("signed-out");
          auth.clear();
        } else {
          setUser(login);
          setStatus("signed-in");
        }
      })
      .catch(() => { auth.clear(); setStatus("signed-out"); });
  }, []);

  if (status === "checking")
    return <div className="max-w-3xl mx-auto px-6 py-24 text-ink-soft">Checking access…</div>;

  if (status === "signed-out") return <SignIn onDone={() => window.location.reload()} />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-8 pb-6 border-b border-rule dark:border-rule-dk flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Studio</p>
          <h1 className="font-display italic text-4xl">Publishing desk</h1>
          <p className="text-sm text-ink-soft dark:text-ink-soft-dk mt-1">
            Signed in as <code className="font-mono text-brass-deep dark:text-brass">{user}</code>
          </p>
        </div>
        <button
          onClick={() => { auth.clear(); window.location.reload(); }}
          className="text-sm text-ink-soft dark:text-ink-soft-dk underline hover:text-brick"
        >
          Sign out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8">
        {[
          { to: "/admin/new-post", label: "New post" },
          { to: "/admin/new-project", label: "New project" },
          { to: "/admin/content", label: "Existing content" },
        ].map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-ink text-paper border-ink dark:bg-brass dark:text-ink dark:border-brass"
                  : "border-rule dark:border-rule-dk text-ink-soft dark:text-ink-soft-dk hover:border-brass"
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
    <div className="max-w-md mx-auto px-6 py-24">
      <p className="eyebrow mb-3">Studio</p>
      <h1 className="font-display italic text-4xl mb-3">Sign in.</h1>
      <p className="text-ink-soft dark:text-ink-soft-dk mb-6 text-sm leading-relaxed">
        Paste a GitHub Personal Access Token with <code className="font-mono">contents: write</code> and{" "}
        <code className="font-mono">issues: write</code> access to this repo. It's stored only in your browser's
        localStorage and sent directly to github.com. No third party sees it.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Personal access token</label>
          <input
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="github_pat_…"
            className="w-full px-3 py-2 rounded-md border border-rule dark:border-rule-dk bg-paper dark:bg-paper-dk font-mono text-sm focus:border-brass outline-none"
            autoComplete="off"
            required
          />
        </div>
        {error && <p className="text-brick text-sm">{error}</p>}
        <button
          type="submit"
          disabled={busy || !pat}
          className="w-full px-5 py-2.5 rounded-md bg-ink text-paper dark:bg-brass dark:text-ink font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {busy ? "Verifying…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-xs text-ink-soft dark:text-ink-soft-dk">
        Need a token?{" "}
        <a
          href="https://github.com/settings/personal-access-tokens"
          className="underline text-brass-deep dark:text-brass"
        >
          Create a fine-grained PAT
        </a>{" "}
        with access to just this repo. Scopes: Contents (RW), Issues (RW), Metadata (R).
      </p>
      <Link to="/" className="mt-8 block text-center text-sm text-ink-soft dark:text-ink-soft-dk underline">
        ← Back to site
      </Link>
    </div>
  );
}
