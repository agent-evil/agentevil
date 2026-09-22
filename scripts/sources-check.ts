import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
const urls = new Set<string>();
for (const dir of ['src/content/atlas','src/content/posts']) for (const file of await readdir(dir)) {
 const text = await readFile(`${dir}/${file}`,'utf8');
 const data = JSON.parse(file.endsWith('.mdx') ? text.split('---')[1] : text);
 for (const source of data.sources || []) if (!source.url.startsWith('https://agentevil.com/')) urls.add(source.url);
}
const pending = [...urls];
const results: {url:string;status:number|string;destination?:string}[]=[];
async function worker() {
 for (;;) {
  const url=pending.shift(); if (!url) return;
  try {
   const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'AgentEvil-SourceLinkCheck/1.0','Accept-Encoding':'identity'}});
   results.push({url,status:response.status,destination:response.url});
   await response.body?.cancel().catch(()=>{});
  } catch(error) {results.push({url,status:error instanceof Error ? error.name : 'fetch failed'});}
 }
}
await Promise.all(Array.from({length:4},worker));
await mkdir('test-results',{recursive:true});
await writeFile('test-results/source-links.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({checked:results.length,attention:results.filter(result=>typeof result.status!=='number'||result.status>=400)},null,2));
