import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'bun';

const base=process.env.TEST_URL || 'http://localhost:4322';
const output='test-results/lighthouse';
await mkdir(output,{recursive:true});
const routes=['/','/zh/','/fr/','/posts/','/posts/manifesto/','/zh/posts/manifesto/','/fr/posts/maintenance/','/fr/posts/think-for-yourself/','/zh/atlas/','/fr/atlas/ai-alignment/','/about/','/incident/'];
const categories=['performance','accessibility','best-practices','seo'] as const;
const results: {route:string;scores:Record<string,number>;failures:string[]}[]=[];
for (const route of routes) {
 const file=`${output}/${route.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','-')||'home'}.json`;
 const child=spawn(['bunx','--no-install','lighthouse',base+route,'--chrome-flags=--headless --no-sandbox','--only-categories='+categories.join(','),'--output=json','--output-path='+file,'--quiet'],{env:{...process.env,CHROME_PATH:process.env.CHROME_PATH||'/usr/bin/google-chrome'},stdout:'pipe',stderr:'pipe'});
 const [exit,stderr]=await Promise.all([child.exited,new Response(child.stderr).text()]);
 if(exit!==0) throw new Error(`Lighthouse ${route}: ${stderr}`);
 const report=JSON.parse(await readFile(file,'utf8'));
 const scores=Object.fromEntries(categories.map(category=>[category,Math.round(report.categories[category].score*100)]));
 const failures=categories.filter(category=>scores[category]<95).map(category=>`${category}: ${scores[category]} < 95`);
 results.push({route,scores,failures});
 console.log(JSON.stringify({route,scores,failures}));
}
await writeFile(`${output}/summary.json`,JSON.stringify({base,minimum:95,results},null,2));
if(results.some(result=>result.failures.length)) process.exitCode=1;
