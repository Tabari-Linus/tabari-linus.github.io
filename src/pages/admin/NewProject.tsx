import { useState } from "react";
import { saveProject, uploadAsset } from "../../lib/github";
import { slugify } from "../../lib/slug";
import Markdown from "../../components/Markdown";

export default function NewProject() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [summary, setSummary] = useState("");
  const [stack, setStack] = useState("");
  const [repo, setRepo] = useState("");
  const [demo, setDemo] = useState("");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(99);
  const [cover, setCover] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; issueUrl?: string } | null>(null);

  function updateTitle(v: string) { setTitle(v); if (!slugTouched) setSlug(slugify(v)); }
  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    try { setCover(await uploadAsset(f)); } catch (err: any) { alert(err.message); }
  }
  async function insertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    try { const p = await uploadAsset(f); setBody((b) => `${b}\n\n![${f.name}](${p})\n`); }
    catch (err: any) { alert(err.message); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setResult(null);
    try {
      const stackList = stack.split(",").map((s) => s.trim()).filter(Boolean);
      const { issueUrl } = await saveProject({
        slug: slug || slugify(title),
        title,
        date: new Date().toISOString(),
        summary,
        stack: stackList,
        repo: repo || undefined,
        demo: demo || undefined,
        featured,
        order: Number(order) || 99,
        cover: cover || undefined,
        body,
      });
      setResult({ ok: true, message: "Published. Site rebuilds in ~1 min.", issueUrl });
      setTitle(""); setSlug(""); setSummary(""); setStack(""); setRepo(""); setDemo("");
      setFeatured(false); setOrder(99); setCover(""); setBody(""); setSlugTouched(false);
    } catch (err: any) {
      setResult({ ok: false, message: err.message ?? "Publish failed" });
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title">
          <input required value={title} onChange={(e) => updateTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slug">
          <input required value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            className={`${inputCls} font-mono text-sm`} />
        </Field>
      </div>

      <Field label="Summary" hint="One-line description shown on cards.">
        <input required value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
      </Field>

      <Field label="Tech stack" hint="Comma-separated.">
        <input value={stack} onChange={(e) => setStack(e.target.value)}
          className={inputCls} placeholder="Spring Boot, Kafka, PostgreSQL" />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Repo (owner/name or URL)">
          <input value={repo} onChange={(e) => setRepo(e.target.value)}
            className={inputCls} placeholder="Tabari-Linus/snap-service" />
        </Field>
        <Field label="Demo URL">
          <input value={demo} onChange={(e) => setDemo(e.target.value)} className={inputCls} placeholder="https://…" />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Order" hint="Lower = higher on the list.">
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Featured on homepage">
          <label className="flex items-center gap-2 h-11">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-mint" />
            <span className="text-sm text-body">Yes, show as featured</span>
          </label>
        </Field>
      </div>

      <Field label="Cover image (optional)">
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onCoverUpload} className="text-sm text-soft" />
          {cover && <code className="text-xs font-mono text-mint">{cover}</code>}
        </div>
      </Field>

      <Field label="Case study (Markdown)">
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setPreview(false)} className={tabCls(!preview)}>Write</button>
          <button type="button" onClick={() => setPreview(true)} className={tabCls(preview)}>Preview</button>
          <label className="ml-auto text-xs text-soft cursor-pointer flex items-center gap-2 border border-line rounded-md px-3 py-1 hover:border-mint hover:text-mint transition-colors">
            + Image
            <input type="file" accept="image/*" onChange={insertImage} className="hidden" />
          </label>
        </div>
        {preview ? (
          <div className="min-h-96 p-5 rounded-md border border-line bg-surface">
            <Markdown>{body || "*Nothing to preview yet.*"}</Markdown>
          </div>
        ) : (
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            className={`${inputCls} font-mono text-sm min-h-96`}
            placeholder="## Overview\n\n## Architecture\n\n## Trade-offs" />
        )}
      </Field>

      {result && (
        <div className={`p-4 rounded-md border ${result.ok ? "border-mint/50 bg-mint/5 text-mint" : "border-red-500/50 bg-red-500/10 text-red-400"}`}>
          <p className="font-mono text-sm font-medium">{result.message}</p>
          {result.issueUrl && (
            <a href={result.issueUrl} target="_blank" rel="noreferrer" className="text-xs underline mt-1 inline-block">
              Tracking issue →
            </a>
          )}
        </div>
      )}

      <div className="border-t border-line pt-6">
        <button type="submit" disabled={busy || !title || !summary} className="btn-primary disabled:opacity-50">
          {busy ? "Publishing…" : "Publish project"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-md border border-line bg-surface text-body focus:border-mint outline-none transition-colors";
const tabCls = (active: boolean) =>
  `px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
    active ? "bg-mint text-black" : "text-soft hover:text-body border border-line"
  }`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-mute mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-mute mt-1.5">{hint}</p>}
    </div>
  );
}
