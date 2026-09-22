import sharp from 'sharp';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { languages, copy, type Lang } from '../src/lib/i18n';
import { postTitles } from '../src/lib/post-translations';
import { socialTagline } from '../src/lib/seo';

// Fail explicitly instead of publishing unreadable Chinese glyphs on a new build host.
const family = execFileSync('fc-match',['-f','%{family}','Noto Sans CJK SC'],{encoding:'utf8'});
if (!family.includes('Noto Sans CJK SC')) throw new Error('Social images require Noto Sans CJK SC. On Ubuntu: sudo apt-get install fonts-noto-cjk fontconfig');
const escape = (text: string) => text.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]!));
const posts: { slug:string; lang:Lang; title:string }[] = [];
for (const file of await readdir('src/content/posts')) {
 if (file.endsWith('.mdx')) posts.push(JSON.parse((await readFile(`src/content/posts/${file}`,'utf8')).split('---')[1]));
}
const art = await sharp('public/images/yeti-broadcast-neutral.webp').resize(486,456,{fit:'cover'}).png().toBuffer();
let count = 0;
for (const lang of languages) {
 await mkdir(`public/og/${lang}`,{recursive:true});
 const titles = [{slug:'default',title:socialTagline[lang]},...posts.filter(post=>post.lang==='en').map(post=>({
  slug:post.slug,
  title:posts.find(item=>item.slug===post.slug&&item.lang===lang)?.title ?? (lang==='en'?post.title:postTitles[post.slug]?.[lang]?.title) ?? post.title,
 }))];
 for (const {slug,title} of titles) {
  const font=lang==='zh'?'Noto Sans CJK SC':'DejaVu Sans';
  const heading = await sharp({text:{text:`<span foreground="#e8e5dc" weight="bold">${escape(title)}</span>`,font:`${font} 46`,width:555,height:366,rgba:true,wrap:'word-char',spacing:8}}).png().toBuffer();
  const label = await sharp({text:{text:`<span foreground="#aaa9a0">${escape(copy[lang].satire)} · agentevil.com</span>`,font:`${font} 18`,width:1090,height:30,rgba:true}}).png().toBuffer();
  const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#171817"/><text x="54" y="77" font-family="DejaVu Sans,sans-serif" font-size="26" font-weight="bold" fill="#d7bc68">AGENT EVIL</text><path d="M54 107H1146" stroke="#41443e"/></svg>`;
  await sharp(Buffer.from(background)).composite([{input:art,left:660,top:125},{input:heading,left:54,top:146},{input:label,left:54,top:553}]).png().toFile(`public/og/${lang}/${slug}.png`);
  count++;
 }
}
console.log(`Generated ${count} localized 1200×630 social images.`);
