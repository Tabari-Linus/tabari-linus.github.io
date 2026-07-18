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
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const path = await uploadAsset(f);
      setCover(path);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  }

  async function insertImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const path = await uploadAsset(f);
      setBody((b) => `${b}\n\n![${f.name}](${path})\n`);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
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
      setResult({
        ok: true,
        message: `Published — commit is queued. Site will rebuild in ~1 min.`,
        issueUrl,
      });
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
          <input
            required
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className={inputCls}
            placeholder="A post title"
          />
        </Field>
        <Field label="Slug" hint="URL segment; auto-generated from title.">
          <input
            required
            value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            className={`${inputCls} font-mono text-sm`}
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Publish date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Tags" hint="Comma-separated.">
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} placeholder="spring-boot, kafka" />
        </Field>
      </div>

      <Field label="Excerpt" hint="One-line summary shown on the blog index.">
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputCls} />
      </Field>

      <Field label="Cover image (optional)" hint="Uploads to /content/assets/ and commits.">
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onCoverUpload} className="text-sm" />
          {cover && <code className="text-xs font-mono text-brass-deep dark:text-brass">{cover}</code>}
        </div>
      </Field>

      <Field label="Body (Markdown)">
        <div className="flex gap-2 mb-2">
          <button type="button" onClick={() => setPreview(false)}
            className={tabCls(!preview)}>Write</button>
          <button type="button" onClick={() => setPreview(true)}
            className={tabCls(preview)}>Preview</button>
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
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputCls} font-mono text-sm min-h-[24rem]`}
            placeholder="## Introduction&#10;&#10;Write your post in Markdown…"
          />
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

      <div className="flex gap-3 pt-2 border-t border-rule dark:border-rule-dk pt-6">
        <button type="submit" disabled={busy || !title}
          className="px-5 py-2.5 rounded-md bg-ink text-paper dark:bg-brass dark:text-ink font-medium hover:opacity-90 disabled:opacity-50">
          {busy ? "Publishing…" : "Publish post"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-md border border-rule dark:border-rule-dk bg-paper dark:bg-paper-dk focus:border-brass outline-none transition-colors";

const tabCls = (active: boolean) =>
  `px-3 py-1 rounded-md text-sm font-medium ${
    active ? "bg-ink text-paper dark:bg-brass dark:text-ink" : "text-ink-soft dark:text-ink-soft-dk hover:text-ink"
  }`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-ink-soft dark:text-ink-soft-dk mt-1">{hint}</p>}
    </div>
  );
}
