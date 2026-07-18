import { useEffect, useState } from "react";
import { getManifest, deletePost, deleteProject } from "../../lib/github";
import type { Manifest } from "../../types";

export default function ContentList() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [busy, setBusy] = useState<string>("");

  async function load() { setManifest(await getManifest()); }
  useEffect(() => { load(); }, []);

  async function onDeletePost(slug: string) {
    if (!confirm(`Delete post "${slug}"? This is permanent.`)) return;
    setBusy(`post:${slug}`);
    try { await deletePost(slug); await load(); }
    catch (err: any) { alert(err.message); }
    finally { setBusy(""); }
  }
  async function onDeleteProject(slug: string) {
    if (!confirm(`Delete project "${slug}"? This is permanent.`)) return;
    setBusy(`proj:${slug}`);
    try { await deleteProject(slug); await load(); }
    catch (err: any) { alert(err.message); }
    finally { setBusy(""); }
  }

  if (!manifest) return <p className="text-ink-soft">Loading…</p>;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <section>
        <h2 className="font-display italic text-2xl mb-4">Blog posts</h2>
        {manifest.posts.length === 0 ? (
          <p className="text-ink-soft text-sm">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-rule dark:divide-rule-dk">
            {manifest.posts.map((p) => (
              <li key={p.slug} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs font-mono text-ink-soft dark:text-ink-soft-dk truncate">{p.slug}</p>
                </div>
                <button onClick={() => onDeletePost(p.slug)}
                  disabled={busy === `post:${p.slug}`}
                  className="text-xs text-brick underline hover:opacity-70 disabled:opacity-50">
                  {busy === `post:${p.slug}` ? "…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display italic text-2xl mb-4">Projects</h2>
        {manifest.projects.length === 0 ? (
          <p className="text-ink-soft text-sm">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-rule dark:divide-rule-dk">
            {manifest.projects.map((p) => (
              <li key={p.slug} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title} {p.featured && <span className="chip ml-2">★</span>}</p>
                  <p className="text-xs font-mono text-ink-soft dark:text-ink-soft-dk truncate">{p.slug}</p>
                </div>
                <button onClick={() => onDeleteProject(p.slug)}
                  disabled={busy === `proj:${p.slug}`}
                  className="text-xs text-brick underline hover:opacity-70 disabled:opacity-50">
                  {busy === `proj:${p.slug}` ? "…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
