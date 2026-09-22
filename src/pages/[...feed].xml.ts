import rss from '@astrojs/rss';
import { getPosts, postText } from '../lib/content';
import { copy, languages, path, type Lang } from '../lib/i18n';
import type { APIContext } from 'astro';
export function getStaticPaths() {
 return languages.map(lang => ({params:{feed:lang==='en'?'rss':`${lang}/rss`},props:{lang}}));
}
export async function GET(context: APIContext) {
 const lang = context.props.lang as Lang;
 return rss({title:`Agent Evil (${lang})`,description:copy[lang].intro,site:context.site!,items:(await getPosts(lang)).map(post => {
  const p = postText(post,lang);
  return {title:p.title,description:p.description,pubDate:p.date,link:path(lang,`posts/${p.slug}/`)};
 }),customData:`<language>${lang}</language>`});
}
