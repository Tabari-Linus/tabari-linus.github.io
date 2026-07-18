import { Link } from "react-router-dom";
import type { PostMeta } from "../types";

export default function PostRow({ post }: { post: PostMeta }) {
  const date = new Date(post.date);
  const fmt = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex items-baseline gap-4 py-5 border-b border-line hover:border-line-strong transition-colors"
    >
      <time className="font-mono text-xs uppercase tracking-wider text-mute shrink-0 w-28">
        {fmt}
      </time>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg font-semibold text-body group-hover:text-mint transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-soft mt-1 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1.5 mt-2.5">
            {post.tags.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}
      </div>
      <span className="font-mono text-xs text-mute group-hover:text-mint transition-colors">
        →
      </span>
    </Link>
  );
}
