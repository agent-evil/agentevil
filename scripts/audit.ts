import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const errors: string[] = [];
async function walk(dir: string): Promise<string[]> {
 const entries = await readdir(dir,{withFileTypes:true});
 return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir,entry.name)) : [path.join(dir,entry.name)]))).flat();
}
const files = await walk('dist');
const fileSet = new Set(files);
const html = new Map(await Promise.all(files.filter(file => file.endsWith('.html')).map(async file => [file,await readFile(file,'utf8')] as const)));
const decode = (text: string) => text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#(\d+);/g,(_,number) => String.fromCodePoint(Number(number)));
const required = ['index.html','404.html','sitemap-index.xml','sitemap-0.xml','favicon.svg','llms.txt','robots.txt'];
const atlas = await Promise.all((await readdir('src/content/atlas')).filter(file=>file.endsWith('.json')).map(async file=>JSON.parse(await readFile(`src/content/atlas/${file}`,'utf8'))));
const postFiles = (await readdir('src/content/posts')).filter(file=>file.endsWith('.mdx'));
const posts = await Promise.all(postFiles.map(async file=>JSON.parse((await readFile(`src/content/posts/${file}`,'utf8')).split('---')[1])));
const slugs = new Set(atlas.map(entry=>entry.slug));
if (atlas.length < 24 || posts.filter(post=>post.lang==='en').length !== 6) errors.push('Unexpected launch content count.');
for (const slug of new Set(posts.map(post=>post.slug))) {
 for (const lang of ['en','zh','fr']) {
  if (posts.filter(post=>post.slug===slug&&post.lang===lang).length!==1) errors.push(`${slug}: expected exactly one ${lang} translation`);
 }
}
for (const entry of atlas) for (const slug of entry.related) if (!slugs.has(slug)) errors.push(`${entry.slug}: unknown related entry ${slug}`);
for (const post of posts) for (const slug of post.relatedAtlas) if (!slugs.has(slug)) errors.push(`${post.slug}: unknown Atlas reference ${slug}`);
for (const prefix of ['', 'zh/', 'fr/']) {
 for (const route of ['', 'posts/', 'atlas/', 'about/', 'incident/']) required.push(`${prefix}${route}index.html`);
 required.push(`${prefix}rss.xml`);
 for (const entry of atlas) required.push(`${prefix}atlas/${entry.slug}/index.html`);
 for (const post of posts.filter(post=>post.lang==='en')) required.push(`${prefix}posts/${post.slug}/index.html`);
 const feed = await readFile(`dist/${prefix}rss.xml`,'utf8');
 if ((feed.match(/<item>/g)||[]).length !== 6) errors.push(`${prefix}rss.xml: expected six items`);
}
for (const route of required) if (!fileSet.has(`dist/${route}`)) errors.push(`Missing output: ${route}`);
const ids = new Map([...html].map(([file,text])=>[file,new Set([...text.matchAll(/\bid="([^"]+)"/g)].map(match=>decode(match[1])))]));
const origin = 'https://agentevil.com';
const sitemap = await readFile('dist/sitemap-0.xml','utf8');
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>decode(match[1]));
const expectedURLs = [...html.keys()].filter(file=>!/(?:\/404\/index\.html|\/404\.html)$/.test(file)).map(file=>new URL(file.slice(4).replace(/index\.html$/,''),origin+'/').href);
if (sitemapURLs.length!==new Set(sitemapURLs).size || sitemapURLs.length!==expectedURLs.length || expectedURLs.some(url=>!sitemapURLs.includes(url))) errors.push('Sitemap must contain each indexable canonical URL exactly once, with no error pages.');
for (const entry of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
 for (const locale of ['en','zh-CN','fr']) if (!entry[1].includes(`hreflang="${locale}"`)) errors.push('Sitemap entry missing language alternates.');
}
const robots = await readFile('dist/robots.txt','utf8');
if (!robots.includes(`Sitemap: ${origin}/sitemap-index.xml`) || /Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt must allow the public site and declare its sitemap.');
const llms = await readFile('dist/llms.txt','utf8');
if (!llms.startsWith('# Agent Evil\n') || !llms.includes('All six articles') || !llms.includes('fictional')) errors.push('llms.txt is missing its identity or editorial/language context.');
for (const match of llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
 const url=new URL(match[1]);
 if (url.origin===origin && !fileSet.has(`dist${url.pathname}${url.pathname.endsWith('/')?'index.html':''}`)) errors.push(`Broken llms.txt link: ${url.href}`);
}
const attributes = (tag:string) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match=>[match[1],decode(match[2])]));
const descriptions = new Map<string,string>();
const checkedImages = new Set<string>();
let linkCount = 0, maxInline = 0, maxPage = '';
const globalJS = (await Promise.all(files.filter(file=>/\.m?js$/.test(file)).map(async file=>gzipSync(await readFile(file)).length))).reduce((sum,size)=>sum+size,0);
for (const [file,text] of html) {
 const route = file.slice(4).replace(/index\.html$/,'');
 const url = new URL(route,`${origin}/`);
 const head = text.split('</head>')[0];
 const metaTags = [...head.matchAll(/<meta\b[^>]*>/g)].map(match=>attributes(match[0]));
 const meta = (key:string) => metaTags.filter(tag=>(tag.property??tag.name)===key).map(tag=>tag.content);
 const oneMeta = (key:string) => {const values=meta(key);if(values.length!==1||!values[0]) errors.push(`${file}: expected one nonempty ${key}`);return values[0];};
 const language = /^dist\/(zh|fr)\//.exec(file)?.[1] ?? 'en';
 const errorPage = /(?:\/404\/index\.html|\/404\.html)$/.test(file);
 for (const name of ['description','robots','og:title','og:description','og:type','og:url','og:image','og:image:secure_url','og:image:type','og:image:width','og:image:height','og:image:alt','og:site_name','og:locale','twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt']) oneMeta(name);
 if (meta('robots')[0]?.includes('noindex')!==errorPage) errors.push(`${file}: incorrect indexing policy`);
 const locales:Record<string,string> = {en:'en_US',zh:'zh_CN',fr:'fr_FR'};
 if (meta('og:locale')[0]!==locales[language] || meta('og:locale:alternate').sort().join(',')!==Object.entries(locales).filter(([lang])=>lang!==language).map(([,locale])=>locale).sort().join(',')) errors.push(`${file}: incorrect OG language alternatives`);
 const title = decode(head.match(/<title>([^<]+)<\/title>/)?.[1]??'');
 if (meta('og:title')[0]!==title || meta('twitter:title')[0]!==title || meta('og:description')[0]!==meta('description')[0] || meta('twitter:description')[0]!==meta('description')[0]) errors.push(`${file}: inconsistent social metadata`);
 if (!errorPage) {
  const description=meta('description')[0];
  if (descriptions.has(description)) errors.push(`${file}: description reused from ${descriptions.get(description)}`);
  descriptions.set(description,file);
 }
 const imageURL=meta('og:image')[0]??'';
 if (!imageURL.startsWith(`${origin}/og/${language}/`) || meta('twitter:image')[0]!==imageURL || meta('og:image:secure_url')[0]!==imageURL || meta('og:image:alt')[0]!==meta('twitter:image:alt')[0] || meta('og:image:type')[0]!=='image/png' || meta('twitter:card')[0]!=='summary_large_image') errors.push(`${file}: incorrect localized social image metadata`);
 if (imageURL.startsWith(origin+'/')) {
  const imageFile=`dist${new URL(imageURL).pathname}`;
  if (!fileSet.has(imageFile)) errors.push(`${file}: missing social image ${imageFile}`);
  else if (!checkedImages.has(imageFile)) {
   const bytes=await readFile(imageFile);
   if (bytes.toString('hex',0,8)!=='89504e470d0a1a0a' || bytes.readUInt32BE(16)!==1200 || bytes.readUInt32BE(20)!==630) errors.push(`${imageFile}: expected a 1200×630 PNG`);
   checkedImages.add(imageFile);
  }
 }
 if (!/<html[^>]+lang="(?:en|zh-CN|fr)"/.test(text)) errors.push(`${file}: missing language`);
 if (!/<title>[^<]+<\/title>/.test(text) || !/<meta name="description" content="[^"]+"/.test(text)) errors.push(`${file}: missing metadata`);
 const canonical = text.match(/<link rel="canonical" href="([^"]+)"/);
 if (!canonical || (file!=='dist/404.html' && decode(canonical[1])!==url.href)) errors.push(`${file}: incorrect canonical`);
 if (meta('og:url')[0]!==decode(canonical?.[1]??'')) errors.push(`${file}: incorrect OG URL`);
 const alternates=[...head.matchAll(/<link\b[^>]*>/g)].map(match=>attributes(match[0])).filter(tag=>tag.hreflang);
 for (const locale of ['en','zh-CN','fr','x-default']) {
  const alternate=alternates.filter(tag=>tag.hreflang===locale);
  const targetLang=locale==='zh-CN'?'zh':locale==='fr'?'fr':'en';
  const pageRoute=errorPage?'404/':route.replace(/^\//,'').replace(/^(?:zh|fr)\//,'');
  const expected=errorPage&&targetLang==='en'?'/404.html':`${targetLang==='en'?'/':`/${targetLang}/`}${pageRoute}`;
  if (alternate.length!==1 || alternate[0].href!==origin+expected) errors.push(`${file}: incorrect ${locale} alternate`);
 }
 const inline = [...text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(match=>!match[1].includes('src=')&&!match[1].includes('application/ld+json')).reduce((sum,match)=>sum+gzipSync(match[2]).length,0);
 if (inline>maxInline) {maxInline=inline; maxPage=file;}
 for (const match of text.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
  const value=decode(match[1]);
  if (/^(?:data:|mailto:|tel:)/.test(value)) continue;
  const target=new URL(value,url);
  if (target.origin!==origin) continue;
  const pathname=decodeURIComponent(target.pathname);
  const targetFile=`dist${pathname}${pathname.endsWith('/')?'index.html':''}`;
  linkCount++;
  if (!fileSet.has(targetFile)) errors.push(`${file}: broken link ${value}`);
  else if (target.hash && ids.has(targetFile) && !ids.get(targetFile)!.has(decodeURIComponent(target.hash.slice(1)))) errors.push(`${file}: missing anchor ${value}`);
 }
 if (/\/posts\/[^/]+\/index\.html$/.test(file)) {
  const schema = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!schema || JSON.parse(schema[1])['@type']!=='Article') errors.push(`${file}: missing Article schema`);
  else {
   const data=JSON.parse(schema[1]);
   const slug=/\/posts\/([^/]+)\//.exec(file)![1];
   const post=posts.find(post=>post.slug===slug&&post.lang===language);
   if (!post) {errors.push(`${file}: missing translated source`);continue;}
   const bodyLanguage=post.lang==='zh'?'zh-CN':post.lang;
   if (data.inLanguage!==bodyLanguage || data.image!==imageURL || data.datePublished!==new Date(post.date).toISOString()) errors.push(`${file}: Article schema does not describe its source content`);
   if (oneMeta('article:published_time')!==data.datePublished || oneMeta('article:section')!==data.articleSection || oneMeta('article:author')!==data.author.url || meta('article:tag').length!==post.relatedAtlas.length) errors.push(`${file}: incomplete article metadata`);
  }
  if ((text.match(/class="evil-anchor"/g)||[]).length<4) errors.push(`${file}: missing authored notes`);
 }
}
if (globalJS+maxInline>50*1024) errors.push(`JS budget exceeded: ${globalJS+maxInline} gzip bytes`);
const sizes=await Promise.all(files.map(async file=>({file,size:(await stat(file)).size})));
const largest=sizes.reduce((a,b)=>a.size>b.size?a:b);
if (files.length>20000 || largest.size>25*1024*1024 || files.some(file=>file.includes('/_worker.js'))) errors.push('Build exceeds the static Cloudflare Pages Free deployment constraints.');
if (errors.length) {console.error([...new Set(errors)].join('\n')); process.exitCode=1;}
else console.log(`${html.size} HTML pages; ${linkCount} internal references; ${sitemapURLs.length} sitemap URLs; ${checkedImages.size} localized social images; llms.txt, SEO and Article metadata validated. Cloudflare Pages Free: ${files.length}/20000 files; largest ${largest.size}/26214400 bytes (${largest.file}). Conservative per-page JS ceiling: ${globalJS+maxInline} gzip bytes (${globalJS} shared + ${maxInline} inline; ${maxPage}).`);
