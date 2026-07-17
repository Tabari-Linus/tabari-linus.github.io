# tabari-linus.github.io

Personal portfolio + blog. Astro + Tailwind, deployed to GitHub Pages.
Content (blog posts and projects) is authored as **GitHub Issues** in this
repo and synced into the site at build time.

## How publishing works

| Action | Result |
|---|---|
| Open an issue labeled `blog` | New blog post (extra labels become tags) |
| Open an issue labeled `project` with a leading ```` ```yaml ```` block | New project page |
| Edit the issue | Post/project updates on next sync |
| Close the issue | Content is unpublished |

Images: drag them into the issue body — GitHub hosts them.
**Only issues authored by the repo owner are published** (enforced in both
the workflow gate and `scripts/fetch-content.mjs`).

### Project issue format

    ```yaml
    description: One-line summary shown on cards
    repo: Tabari-Linus/snap-service
    demo: https://example.com
    stack: [Spring Boot, Kafka, PostgreSQL]
    featured: true
    order: 1
    ```
    ## Overview
    Case study body in Markdown...

## Pipeline

- `.github/workflows/deploy.yml` — push to `main` → sync content → build → deploy to Pages
- `.github/workflows/content-sync.yml` — issue opened/edited/labeled/closed → same pipeline
- `scripts/fetch-content.mjs` — GitHub Issues → `src/content/{blog,projects}/*.md`

## Setup (one-time)

1. Create repo `tabari-linus.github.io`, push this code to `main`.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. Create labels `blog` and `project`.
4. Open your first `blog` issue — the site rebuilds itself.

## Local dev

```bash
npm install
npm run dev            # http://localhost:4321
GITHUB_TOKEN=<pat> npm run sync-content   # pull real issue content locally
```

Sample content under `src/content/` lets the site build before the first
real issue exists; the first sync replaces it.
