import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Both collections are populated by scripts/fetch-content.mjs,
// which converts GitHub Issues into these Markdown files.

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    issue: z.number(), // source GitHub issue number
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    repo: z.string().optional(),
    demo: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    issue: z.number(),
    date: z.coerce.date(),
  }),
});

export const collections = { blog, projects };
