export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt?: string;
  tags?: string[];
  cover?: string; // path under /content/assets
  readingMinutes?: number;
};

export type ProjectMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string; // one-line
  stack: string[];
  repo?: string;
  demo?: string;
  featured?: boolean;
  order?: number;
  cover?: string;
};

export type Manifest = {
  posts: PostMeta[];
  projects: ProjectMeta[];
  updatedAt: string;
};
