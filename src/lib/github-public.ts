import { CONFIG } from "../config";

export type GithubStats = { publicRepos: number; followers: number };

/** Public unauthenticated GitHub API — no PAT needed. Cached in sessionStorage. */
export async function fetchGithubStats(): Promise<GithubStats | null> {
  try {
    const cached = sessionStorage.getItem("gh.stats");
    if (cached) return JSON.parse(cached);
    const res = await fetch(`https://api.github.com/users/${CONFIG.githubOwner}`);
    if (!res.ok) return null;
    const j = await res.json();
    const stats = { publicRepos: j.public_repos ?? 0, followers: j.followers ?? 0 };
    sessionStorage.setItem("gh.stats", JSON.stringify(stats));
    return stats;
  } catch {
    return null;
  }
}
