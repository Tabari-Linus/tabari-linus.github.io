import { useState } from "react";
import { savePost, uploadAsset } from "../../lib/github";
import { slugify } from "../../lib/slug";
import Markdown from "../../components/Markdown";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; issueUrl?: string } | null>(null);
  const [cover, setCover] = useState("");

  function updateTitle(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    try { setCover(await uploadAsset(f)); }
    catch (err: any) { alert(err.message); }
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
      const finalSlug = slug || slugify(title);
      const tagList = tags.split(",").map((s) => s.trim()).filter(Boolean);
      const { issueUrl } = await savePost({
        slug: finalSlug,
        title,
        date: new Date(date).toISOString(),
        excerpt,
        tags: tagList,
        cover: cover || undefined,
        body,
      });
      setResult({ ok: true, message: "Published. Site rebuilds in ~1 min.", issueUrl });
      setTitle(""); setSlug(""); setExcerpt(""); setBody(""); setTags(""); setCover("");
      setSlugTouched(false);
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
          <input required value={title} onChange={(e) => updateTitle(e.target.value)}
            className={inputCls} placeholder="A post title" />
        </Field>
        <Field label="Slug" hint="URL segment — auto from title.">
          <input required value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            className={`${inputCls} font-mono text-sm`} />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Publish date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Tags" hint="Comma-separated.">
          <input value={tags} onChange={(e) => setTags(e.target.value)}
            className={inputCls} placeholder="spring-boot, kafka" />
        </Field>
      </div>

      <Field label="Excerpt" hint="Shown on the blog index.">
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputCls} />
      </Field>

      <Field label="Cover image (optional)">
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onCoverUpload} className="text-sm text-soft" />
          {cover && <code className="text-xs font-mono text-mint">{cover}</code>}
        </div>
      </Field>

      <Field label="Body (Markdown)">
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
            placeholder="## Introduction\n\nWrite your post in Markdown…" />
        )}
      </Field>

      {result && <Alert result={result} />}

      <div className="border-t border-line pt-6">
        <button type="submit" disabled={busy || !title} className="btn-primary disabled:opacity-50">
          {busy ? "Publishing…" : "Publish post"}
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

function Alert({ result }: { result: { ok: boolean; message: string; issueUrl?: string } }) {
  return (
    <div className={`p-4 rounded-md border ${result.ok ? "border-mint/50 bg-mint/5 text-mint" : "border-red-500/50 bg-red-500/10 text-red-400"}`}>
      <p className="font-mono text-sm font-medium">{result.message}</p>
      {result.issueUrl && (
        <a href={result.issueUrl} target="_blank" rel="noreferrer" className="text-xs underline mt-1 inline-block">
          Tracking issue →
        </a>
      )}
    </div>
  );
}
