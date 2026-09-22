import { getCollection } from 'astro:content';
import type { Lang } from './i18n';
export async function getPosts(lang:Lang) {
 const all=await getCollection('posts');
 return all.filter(p=>p.data.lang==='en').sort((a,b)=>a.data.order-b.data.order).map(p=>all.find(q=>q.data.slug===p.data.slug&&q.data.lang===lang)??p);
}
import { postTitles } from './post-translations';
export function postText(post:Awaited<ReturnType<typeof getPosts>>[number],lang:Lang) { return lang!=='en'&&post.data.lang!==lang ? {...post.data,...postTitles[post.data.slug]?.[lang]}:post.data; }
