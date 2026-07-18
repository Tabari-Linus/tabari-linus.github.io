import { Link } from "react-router-dom";
import type { PostMeta } from "../types";

export default function PostRow({ post }: { post: PostMeta }) {
  const date = new Date(post.date);
  const fmt = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block py-5 border-b border-rule dark:border-rule-dk last:border-0"
    >
      <div className="flex items-baseline gap-4 flex-wrap">
        <time className="font-mono text-xs uppercase tracking-wider text-ink-soft dark:text-ink-soft-dk shrink-0 w-24">
          {fmt}
        </time>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl italic text-ink dark:text-ink-dk group-hover:text-brass-deep dark:group-hover:text-brass transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-ink-soft dark:text-ink-soft-dk mt-1 text-sm leading-relaxed">{post.excerpt}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {post.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
