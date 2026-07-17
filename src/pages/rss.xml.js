import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  return rss({
    title: `${SITE.title} — Blog`,
    description: 'Backend engineering, Spring Boot, distributed systems.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
