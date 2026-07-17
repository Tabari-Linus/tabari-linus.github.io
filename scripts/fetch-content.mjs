#!/usr/bin/env node
/**
 * fetch-content.mjs — GitHub Issues -> Astro content collections.
 *   label `blog`    -> src/content/blog/<slug>.md
 *   label `project` -> src/content/projects/<slug>.md
 *
 * - Only OPEN issues authored by ALLOWED_AUTHOR are published;
 *   closing an issue unpublishes it (dirs are regenerated each run).
 * - Project issues may start with a fenced ```yaml block
 *   (repo, demo, stack, featured, order) — stripped from the body.
 * - Extra labels on blog issues become tags.
 *
 * Auth: GITHUB_TOKEN (automatic in Actions).
 * Local: GITHUB_TOKEN=<pat> npm run sync-content
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import * as yaml from "js-yaml";

const REPO = process.env.GITHUB_REPOSITORY ?? "Tabari-Linus/tabari-linus.github.io";
const ALLOWED_AUTHOR = process.env.CONTENT_AUTHOR ?? "Tabari-Linus";
const TOKEN = process.env.GITHUB_TOKEN;
const API = "https://api.github.com";
const OUT = { blog: "src/content/blog", project: "src/content/projects" };

if (!TOKEN) {
  console.error("GITHUB_TOKEN is required.");
  process.exit(1);
}

async function fetchAllIssues(label) {
  const issues = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${API}/repos/${REPO}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    issues.push(...batch.filter((i) => !i.pull_request)); // endpoint returns PRs too
    if (batch.length < 100) break;
    page += 1;
  }
  return issues;
}

function slugify(title, n) {
  const s = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${s || "post"}-${n}`; // issue-number suffix = unique, stable URLs
}

function extractYamlBlock(body) {
  const m = body.match(/^\s*```ya?ml\s*\n([\s\S]*?)\n```\s*\n?/);
  if (!m) return [{}, body];
  let meta = {};
  try {
    meta = yaml.load(m[1]) ?? {};
  } catch (e) {
    console.warn(`  ! invalid YAML block ignored: ${e.message}`);
  }
  return [meta, body.slice(m[0].length)];
}

const fm = (o) => `---\n${yaml.dump(o, { lineWidth: 120 })}---\n\n`;

async function run() {
  let published = 0;
  for (const [label, dir] of Object.entries(OUT)) {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, ".gitkeep"), "");

    for (const issue of await fetchAllIssues(label)) {
      // SECURITY: never publish issues opened by anyone else.
      if (issue.user?.login !== ALLOWED_AUTHOR) {
        console.warn(`  ! skipping #${issue.number} — author ${issue.user?.login} not allowed`);
        continue;
      }
      const body = issue.body ?? "";
      const slug = slugify(issue.title, issue.number);
      let meta;
      let content;

      if (label === "blog") {
        content = body;
        meta = {
          title: issue.title,
          date: issue.created_at,
          updated: issue.updated_at,
          tags: issue.labels
            .map((l) => (typeof l === "string" ? l : l.name))
            .filter((n) => n && n !== "blog"),
          issue: issue.number,
        };
      } else {
        const [y, rest] = extractYamlBlock(body);
        content = rest;
        meta = {
          title: issue.title,
          repo: y.repo,
          demo: y.demo,
          stack: Array.isArray(y.stack) ? y.stack.map(String) : [],
          featured: Boolean(y.featured),
          order: Number.isFinite(y.order) ? y.order : 99,
          issue: issue.number,
          date: issue.created_at,
        };
        Object.keys(meta).forEach((k) => meta[k] === undefined && delete meta[k]);
      }

      await writeFile(path.join(dir, `${slug}.md`), fm(meta) + content);
      console.log(`  + ${label} #${issue.number} -> ${dir}/${slug}.md`);
      published += 1;
    }
  }
  console.log(`Done. ${published} item(s) published.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
