/**
 * GitHub API client for the admin panel.
 * Only ever runs in the user's browser; the PAT is stored in localStorage
 * and sent directly to api.github.com.
 */
import type { Manifest, PostMeta, ProjectMeta } from "../types";
import { CONFIG } from "../config";

const API = "https://api.github.com";
const TOKEN_KEY = "portfolio.pat";

export const auth = {
  get token() { return localStorage.getItem(TOKEN_KEY) ?? ""; },
  set token(v: string) { v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY); },
  clear() { localStorage.removeItem(TOKEN_KEY); },
};

type FileResponse = { sha: string; content: string; encoding: "base64" };

function headers() {
  const t = auth.token;
  if (!t) throw new Error("No PAT saved. Add one in Admin → Settings.");
  return {
    Authorization: `Bearer ${t}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

const repoPath = () => `${CONFIG.githubOwner}/${CONFIG.githubRepo}`;

/** Verify the PAT works and has push access. */
export async function verifyToken(): Promise<{ login: string; canPush: boolean }> {
  const me = await fetch(`${API}/user`, { headers: headers() });
  if (!me.ok) throw new Error(`Token check failed (${me.status}): ${(await me.json()).message}`);
  const user = await me.json();

  const repo = await fetch(`${API}/repos/${repoPath()}`, { headers: headers() });
  if (!repo.ok) throw new Error("Cannot access the target repo with this token.");
  const repoData = await repo.json();
  return { login: user.login, canPush: Boolean(repoData.permissions?.push) };
}

async function getFileMaybe(path: string): Promise<FileResponse | null> {
  const res = await fetch(`${API}/repos/${repoPath()}/contents/${path}?ref=${CONFIG.branch}`, {
    headers: headers(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Read failed: ${path} — ${(await res.json()).message}`);
  return res.json();
}

// Browser-safe base64 encoder that handles Unicode.
function toB64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function fromB64(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function putFile(path: string, content: string, message: string): Promise<void> {
  const existing = await getFileMaybe(path);
  const body: Record<string, unknown> = {
    message,
    content: toB64(content),
    branch: CONFIG.branch,
  };
  if (existing) body.sha = existing.sha;
  const res = await fetch(`${API}/repos/${repoPath()}/contents/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Write failed: ${path} — ${(await res.json()).message}`);
}

async function deleteFile(path: string, message: string): Promise<void> {
  const existing = await getFileMaybe(path);
  if (!existing) return;
  const res = await fetch(`${API}/repos/${repoPath()}/contents/${path}`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ message, sha: existing.sha, branch: CONFIG.branch }),
  });
  if (!res.ok) throw new Error(`Delete failed: ${path} — ${(await res.json()).message}`);
}

/** Read the live manifest (from the repo, not the CDN). */
export async function getManifest(): Promise<Manifest> {
  const f = await getFileMaybe("public/content/manifest.json");
  if (!f) return { posts: [], projects: [], updatedAt: new Date().toISOString() };
  return JSON.parse(fromB64(f.content));
}

async function openTrackerIssue(title: string, body: string, label: string): Promise<{ number: number; url: string }> {
  const res = await fetch(`${API}/repos/${repoPath()}/issues`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title, body, labels: [label] }),
  });
  if (!res.ok) {
    // Non-fatal — content still published successfully.
    console.warn("Tracker issue failed:", await res.text());
    return { number: 0, url: "" };
  }
  const j = await res.json();
  return { number: j.number, url: j.html_url };
}

// ---------- Post / project write API used by the admin forms ----------

export type PostInput = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  body: string;
};

export type ProjectInput = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  stack: string[];
  repo?: string;
  demo?: string;
  featured: boolean;
  order: number;
  cover?: string;
  body: string;
};

function toFrontmatter(obj: Record<string, unknown>): string {
  const lines: string[] = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      const inline = `[${v.map((x) => JSON.stringify(String(x))).join(", ")}]`;
      lines.push(`${k}: ${inline}`);
    } else if (typeof v === "boolean" || typeof v === "number") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${JSON.stringify(String(v))}`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

export async function savePost(input: PostInput): Promise<{ issueUrl: string }> {
  const path = `public/content/blog/${input.slug}.md`;
  const meta: PostMeta = {
    slug: input.slug,
    title: input.title,
    date: input.date,
    excerpt: input.excerpt,
    tags: input.tags,
    cover: input.cover,
  };
  const md = toFrontmatter(meta as unknown as Record<string, unknown>) + input.body + "\n";
  await putFile(path, md, `blog: publish ${input.slug}`);

  // Update manifest
  const manifest = await getManifest();
  manifest.posts = [meta, ...manifest.posts.filter((p) => p.slug !== input.slug)].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
  manifest.updatedAt = new Date().toISOString();
  await putFile(
    "public/content/manifest.json",
    JSON.stringify(manifest, null, 2),
    "manifest: sync after blog write",
  );

  const issue = await openTrackerIssue(
    `Blog published: ${input.title}`,
    `Auto-created tracker.\n\n- Slug: \`${input.slug}\`\n- File: \`${path}\`\n- Live: /blog/${input.slug}\n`,
    "blog-tracker",
  );
  return { issueUrl: issue.url };
}

export async function saveProject(input: ProjectInput): Promise<{ issueUrl: string }> {
  const path = `public/content/projects/${input.slug}.md`;
  const meta: ProjectMeta = {
    slug: input.slug,
    title: input.title,
    date: input.date,
    summary: input.summary,
    stack: input.stack,
    repo: input.repo,
    demo: input.demo,
    featured: input.featured,
    order: input.order,
    cover: input.cover,
  };
  const md = toFrontmatter(meta as unknown as Record<string, unknown>) + input.body + "\n";
  await putFile(path, md, `project: publish ${input.slug}`);

  const manifest = await getManifest();
  manifest.projects = [meta, ...manifest.projects.filter((p) => p.slug !== input.slug)].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  );
  manifest.updatedAt = new Date().toISOString();
  await putFile(
    "public/content/manifest.json",
    JSON.stringify(manifest, null, 2),
    "manifest: sync after project write",
  );

  const issue = await openTrackerIssue(
    `Project published: ${input.title}`,
    `Auto-created tracker.\n\n- Slug: \`${input.slug}\`\n- File: \`${path}\`\n- Live: /projects/${input.slug}\n`,
    "project-tracker",
  );
  return { issueUrl: issue.url };
}

export async function deletePost(slug: string): Promise<void> {
  await deleteFile(`public/content/blog/${slug}.md`, `blog: remove ${slug}`);
  const manifest = await getManifest();
  manifest.posts = manifest.posts.filter((p) => p.slug !== slug);
  manifest.updatedAt = new Date().toISOString();
  await putFile("public/content/manifest.json", JSON.stringify(manifest, null, 2), "manifest: remove blog");
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteFile(`public/content/projects/${slug}.md`, `project: remove ${slug}`);
  const manifest = await getManifest();
  manifest.projects = manifest.projects.filter((p) => p.slug !== slug);
  manifest.updatedAt = new Date().toISOString();
  await putFile("public/content/manifest.json", JSON.stringify(manifest, null, 2), "manifest: remove project");
}

export async function uploadAsset(file: File): Promise<string> {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const key = `${Date.now()}-${safe}`;
  const path = `public/content/assets/${key}`;

  const b64 = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });

  const req = await fetch(`${API}/repos/${repoPath()}/contents/${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      message: `asset: upload ${key}`,
      content: b64,
      branch: CONFIG.branch,
    }),
  });
  if (!req.ok) throw new Error(`Upload failed — ${(await req.json()).message}`);
  return `/content/assets/${key}`;
}
