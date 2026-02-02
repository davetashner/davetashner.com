import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://davetashner.com';

interface SitemapEntry {
  url: string;
  lastmod: string;
  priority: string;
  changefreq: string;
}

export const GET: APIRoute = async () => {
  // Get all blog posts
  const blogPosts = await getCollection('blog');

  // Static pages with their priorities
  const staticPages: SitemapEntry[] = [
    {
      url: '/',
      lastmod: new Date().toISOString().split('T')[0],
      priority: '1.0',
      changefreq: 'weekly',
    },
    {
      url: '/about',
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      url: '/contact',
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      url: '/blog',
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'weekly',
    },
  ];

  // Generate blog post entries
  const blogEntries: SitemapEntry[] = blogPosts.map((post) => {
    const lastmod = post.data.updatedDate || post.data.pubDate;
    return {
      url: `/blog/${post.id}`,
      lastmod:
        lastmod instanceof Date
          ? lastmod.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      priority: '0.6',
      changefreq: 'monthly',
    };
  });

  // Combine all entries
  const allEntries = [...staticPages, ...blogEntries];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
