import type { Manifest } from "../types";

async function fetchText(path: string): Promise<string> {
  const res = await fetch(`${path}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${path} (${res.status})`);
  return res.text();
}

export async function loadManifest(): Promise<Manifest> {
  const res = await fetch(`/content/manifest.json?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return { posts: [], projects: [], updatedAt: new Date().toISOString() };
  return res.json();
}

/**
 * Minimal frontmatter parser — supports only what our admin form writes:
 *   - Strings (double-quoted JSON-safe)
 *   - Numbers, true/false
 *   - Inline arrays: [ "a", "b" ]
 * Blocks & multiline values aren't supported by design (form doesn't emit them).
 */
function parseFrontmatter(source: string): { data: Record<string, unknown>; body: string } {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: source };
  const yaml = m[1];
  const body = source.slice(m[0].length);
  const data: Record<string, unknown> = {};

  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawIn] = kv;
    const raw = rawIn.trim();
    if (raw === "") continue;

    if (raw.startsWith("[") && raw.endsWith("]")) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    } else if (raw === "true" || raw === "false") {
      data[key] = raw === "true";
    } else if (/^-?\d+(\.\d+)?$/.test(raw)) {
      data[key] = Number(raw);
    } else if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      try { data[key] = JSON.parse(raw.replace(/^'|'$/g, '"')); }
      catch { data[key] = raw.slice(1, -1); }
    } else {
      data[key] = raw;
    }
  }
  return { data, body };
}

export async function loadPost(slug: string) {
  const raw = await fetchText(`/content/blog/${slug}.md`);
  const { data, body } = parseFrontmatter(raw);
  return { meta: data, body };
}

export async function loadProject(slug: string) {
  const raw = await fetchText(`/content/projects/${slug}.md`);
  const { data, body } = parseFrontmatter(raw);
  return { meta: data, body };
}

export function estimateReadingMinutes(md: string): number {
  const words = md.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
