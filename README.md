# tabari-linus.github.io

Portfolio and blog for **Linus Tabari** — Backend Engineer, Kumasi.

**Stack:** React 19 + Tailwind CSS v4 + Vite · deployed to GitHub Pages · GitHub API as the content backend.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  React SPA (Vite build → static files on Pages)        │
│                                                        │
│  Public routes: /, /projects, /blog, and details       │
│  Admin route:   /admin (PAT-gated, in-browser only)    │
│                                                        │
│  Content served from /public/content/                  │
│    · manifest.json (index)                             │
│    · blog/*.md  (posts)                                │
│    · projects/*.md  (case studies)                     │
│    · assets/*  (uploaded images)                       │
└────────────────────────────────────────────────────────┘
                          ▲
                          │ (writes)
┌────────────────────────────────────────────────────────┐
│  Admin form (in your browser)                          │
│    · Auth: fine-grained PAT in localStorage            │
│    · Writes .md + updates manifest via Contents API    │
│    · Opens a tracker Issue via Issues API              │
│    · Uploads images to /content/assets/                │
└────────────────────────────────────────────────────────┘
                          ▲
                          │ push
┌────────────────────────────────────────────────────────┐
│  GitHub Actions (.github/workflows/deploy.yml)         │
│    · on push → npm run build → deploy to Pages         │
└────────────────────────────────────────────────────────┘
```

## First-time setup

1. Push this repo to `github.com/<you>/<you>.github.io`.
2. **Settings → Pages → Source: GitHub Actions**.
3. Wait for the first deploy to go green.
4. Visit `https://<you>.github.io/admin`.
5. Create a fine-grained PAT:
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository access: only this repo
   - Permissions: Contents (RW), Issues (RW), Metadata (R)
6. Paste it into the admin sign-in. It stays in your browser's localStorage.

## Publishing

- **New post/project** → Admin → fill form → Publish. Site rebuilds in ~1 min.
- **Images** → drop in the "+ Image" input in the editor; they upload to `/content/assets/`.
- **Delete** → Admin → Existing content.
- Every publish opens a tracking Issue (`blog-tracker` / `project-tracker` label) for reference.

## Local development

```bash
npm install
npm run dev
```

## Customization

`src/config.ts` — name, tagline, socials, GitHub identity. Everything derives from there.
