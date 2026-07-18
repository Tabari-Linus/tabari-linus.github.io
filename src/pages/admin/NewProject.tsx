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

  function updateTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

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
      setResult({ ok: true, message: "Published — site rebuilds in ~1 min.", issueUrl });
      setTitle(""); setSlug(""); setSummary(""); setStack(""); setRepo(""); setDemo("");
      setFeatured(false); setOrder(99); setCover(""); setBody(""); setSlugTouched(false);
    } catch (err: any) {
      setResult({ ok: false, message: err.message ?? "Publish failed" });
    } finally {
      setBusy(false);
    }
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
        <input value={stack} onChange={(e) => setStack(e.target.value)} className={inputCls}
          placeholder="Spring Boot, Kafka, PostgreSQL" />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Repo (owner/name or full URL)">
          <input value={repo} onChange={(e) => setRepo(e.target.value)} className={inputCls}
            placeholder="Tabari-Linus/snap-service" />
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
          <label className="flex items-center gap-2 h-10">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-brass" />
            <span className="text-sm">Yes, show as featured</span>
          </label>
        </Field>
      </div>

      <Field label="Cover image (optional)">
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onCoverUpload} className="text-sm" />
          {cover && <code className="text-xs font-mono text-brass-deep dark:text-brass">{cover}</code>}
        </div>
      </Field>

      <Field label="Case study (Markdown)">
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setPreview(false)} className={tabCls(!preview)}>Write</button>
          <button type="button" onClick={() => setPreview(true)} className={tabCls(preview)}>Preview</button>
          <label className="ml-auto text-xs text-ink-soft dark:text-ink-soft-dk cursor-pointer flex items-center gap-2 border border-rule dark:border-rule-dk rounded-md px-2 py-1 hover:border-brass">
            + Image
            <input type="file" accept="image/*" onChange={insertImage} className="hidden" />
          </label>
        </div>
        {preview ? (
          <div className="min-h-[24rem] p-4 rounded-md border border-rule dark:border-rule-dk bg-paper-2/40 dark:bg-paper-2-dk/40">
            <Markdown>{body || "*Nothing to preview yet.*"}</Markdown>
          </div>
        ) : (
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            className={`${inputCls} font-mono text-sm min-h-[24rem]`}
            placeholder="## Overview&#10;&#10;What the project does and why it matters.&#10;&#10;## Architecture&#10;&#10;## Trade-offs" />
        )}
      </Field>

      {result && (
        <div className={`p-4 rounded-md border ${result.ok ? "border-teal text-teal" : "border-brick text-brick"}`}>
          <p className="font-medium">{result.message}</p>
          {result.issueUrl && (
            <a href={result.issueUrl} className="text-xs underline mt-1 inline-block" target="_blank" rel="noreferrer">
              Tracking issue →
            </a>
          )}
        </div>
      )}

      <div className="flex gap-3 border-t border-rule dark:border-rule-dk pt-6">
        <button type="submit" disabled={busy || !title || !summary}
          className="px-5 py-2.5 rounded-md bg-ink text-paper dark:bg-brass dark:text-ink font-medium hover:opacity-90 disabled:opacity-50">
          {busy ? "Publishing…" : "Publish project"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-md border border-rule dark:border-rule-dk bg-paper dark:bg-paper-dk focus:border-brass outline-none transition-colors";
const tabCls = (active: boolean) =>
  `px-3 py-1 rounded-md text-sm font-medium ${active ? "bg-ink text-paper dark:bg-brass dark:text-ink" : "text-ink-soft dark:text-ink-soft-dk hover:text-ink"}`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-soft dark:text-ink-soft-dk mt-1">{hint}</p>}
    </div>
  );
}
