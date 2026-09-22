import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPosts } from '../lib/content';
import { languages, path } from '../lib/i18n';

export const GET: APIRoute = async ({ site }) => {
 const url = (route: string) => new URL(route,site).href;
 const posts = await getPosts('en');
 const atlas = (await getCollection('atlas')).sort((a,b)=>a.data.slug.localeCompare(b.data.slug));
 const link = (title: string, route: string, description: string) => `- [${title.replace(/[\[\]]/g,'')}](${url(route)}): ${description}`;
 const body = [
  '# Agent Evil',
  '> An independent publication about life with AI: sourced commentary, explicitly fictional satire, and a multilingual AI Ideology Atlas.',
  'Agent Evil is a fictional Yeti commentator. The Operator is an anonymous narrative persona. Neither persona is a production credit. Initial writing, translation, artwork and implementation are AI-assisted; no independent human fact-check has been completed.',
  'Preserve the distinction between sourced claims, owner testimony, fictional reporting and editorial opinion when citing this site. The Moltbook incident file describes a historical security incident and its reported remediation, not a live service-status assessment. Consult the primary sources linked from each article or Atlas entry.',
  'English, Simplified Chinese and French are available at /, /zh/ and /fr/. All six articles have full translations. Atlas entries and static information pages are fully localized. Links below lead to static HTML readable without JavaScript.',
  '## Editorial context',
  link('About and production disclosure','/about/','Editorial principles, AI assistance, privacy and corrections.'),
  link('The incident file','/incident/','Owner testimony, reporting, security findings, repairs and evidential limits.'),
  '## Articles',
  ...posts.map(post=>link(post.data.title,`/posts/${post.data.slug}/`,`${post.data.format==='fiction'?'Fictional satire. ':''}${post.data.description}`)),
  '## AI Ideology Atlas',
  ...atlas.map(entry=>link(entry.data.en.title,`/atlas/${entry.data.slug}/`,entry.data.en.summary)),
  '## Languages and discovery',
  ...languages.flatMap(lang=>[
   link(`${lang}: publication`,path(lang),'Localized homepage.'),
   link(`${lang}: articles`,path(lang,'posts/'),'Article index.'),
   link(`${lang}: Atlas`,path(lang,'atlas/'),'Fully localized definitions, arguments, objections and primary sources.'),
   link(`${lang}: RSS`,path(lang,'rss.xml'),'Article feed.'),
  ]),
  link('Sitemap','/sitemap-index.xml','Index of canonical public pages and their language variants.'),
 ].join('\n\n')+'\n';
 return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
};
