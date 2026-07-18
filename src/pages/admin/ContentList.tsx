import { useEffect, useState } from "react";
import { getManifest, deletePost, deleteProject } from "../../lib/github";
import type { Manifest } from "../../types";

export default function ContentList() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [busy, setBusy] = useState<string>("");

  async function load() { setManifest(await getManifest()); }
  useEffect(() => { load(); }, []);

  async function onDeletePost(slug: string) {
    if (!confirm(`Delete post "${slug}"? Permanent.`)) return;
    setBusy(`post:${slug}`);
    try { await deletePost(slug); await load(); }
    catch (err: any) { alert(err.message); }
    finally { setBusy(""); }
  }
  async function onDeleteProject(slug: string) {
    if (!confirm(`Delete project "${slug}"? Permanent.`)) return;
    setBusy(`proj:${slug}`);
    try { await deleteProject(slug); await load(); }
    catch (err: any) { alert(err.message); }
    finally { setBusy(""); }
  }

  if (!manifest) return <p className="text-soft">Loading…</p>;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <section>
        <h2 className="font-display text-2xl font-semibold text-body mb-5">Blog posts</h2>
        {manifest.posts.length === 0 ? (
          <p className="text-mute text-sm">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-line/60 border border-line rounded-lg">
            {manifest.posts.map((p) => (
              <li key={p.slug} className="py-3 px-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-body truncate">{p.title}</p>
                  <p className="text-xs font-mono text-mute truncate">{p.slug}</p>
                </div>
                <button onClick={() => onDeletePost(p.slug)}
                  disabled={busy === `post:${p.slug}`}
                  className="text-xs text-red-400 hover:text-red-300 font-mono disabled:opacity-50">
                  {busy === `post:${p.slug}` ? "…" : "delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-body mb-5">Projects</h2>
        {manifest.projects.length === 0 ? (
          <p className="text-mute text-sm">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-line/60 border border-line rounded-lg">
            {manifest.projects.map((p) => (
              <li key={p.slug} className="py-3 px-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-body truncate">
                    {p.title}
                    {p.featured && <span className="ml-2 chip text-xs">★</span>}
                  </p>
                  <p className="text-xs font-mono text-mute truncate">{p.slug}</p>
                </div>
                <button onClick={() => onDeleteProject(p.slug)}
                  disabled={busy === `proj:${p.slug}`}
                  className="text-xs text-red-400 hover:text-red-300 font-mono disabled:opacity-50">
                  {busy === `proj:${p.slug}` ? "…" : "delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
