import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await context.newPage();
page.setDefaultTimeout(12000);
const failures: string[] = [];
const base=process.env.TEST_URL || 'http://localhost:4322';
const stateKey='evil:passenger:v1';
const assert=(value:unknown,message:string)=>{if(!value)failures.push(message);};
const state=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),stateKey);
try {
 await page.clock.install();
 for (const slug of ['manifesto','maintenance','think-for-yourself']) {
  await page.goto(`${base}/posts/${slug}/`,{waitUntil:'networkidle'});
  assert(!(await state()).reads?.includes(slug),'Opening an article alone does not complete it');
  await page.locator('[data-read-end]').scrollIntoViewIfNeeded();
  await page.clock.runFor(50);
  assert(!(await state()).reads?.includes(slug),'End visibility alone does not complete reading');
  await page.clock.fastForward(16000);
  await page.waitForFunction(({key,slug})=>JSON.parse(localStorage.getItem(key)||'{}').reads?.includes(slug),{key:stateKey,slug});
 }
 assert((await state()).achievements.includes('reader'),'Three completed reads unlock reader');
 for (const slug of ['eacc','dacc','ai-alignment','automation','creator-consent']) {
  await page.goto(`${base}/atlas/${slug}/`,{waitUntil:'networkidle'});
  await page.locator('[data-read-end]').scrollIntoViewIfNeeded();
  await page.clock.runFor(50); await page.clock.fastForward(5000);
  await page.waitForFunction(({key,slug})=>JSON.parse(localStorage.getItem(key)||'{}').entries?.includes(slug),{key:stateKey,slug});
 }
 assert((await state()).achievements.includes('scholar'),'Five viewed entries unlock scholar');
 await page.locator('[data-open-console]').click();
 await page.evaluate(()=>localStorage.setItem('unrelated-site-key','preserve'));
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('[data-reset]').click();
 assert((await state()).achievements.includes('scholar'),'Cancelled reset preserves progress');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('[data-reset]').click();
 assert(await page.evaluate(key=>localStorage.getItem(key),stateKey)===null,'Confirmed reset removes only site key');
 assert(await page.evaluate(()=>localStorage.getItem('unrelated-site-key'))==='preserve','Reset preserves unrelated storage');
 await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({theme:'bad',lights:[],planet:'invalid',character:'__proto__',mosaics:-8,achievements:['__proto__'],muted:'true'})),stateKey);
 await page.reload({waitUntil:'networkidle'});
 assert(await page.locator('html').getAttribute('data-theme')==='terminal','Invalid theme rejected');
 assert(await page.locator('html').getAttribute('data-muted')==='false','Invalid boolean rejected');
 await page.locator('[data-open-console]').click();
 assert((await page.locator('[data-greeting]').textContent())?.includes('unregistered'),'Invalid role rejected');
}catch(error){failures.push(String(error));}finally{await browser.close();}
await writeFile('test-results/state-report.json',JSON.stringify({failures},null,2));
console.log(JSON.stringify({checks:'Reading dwell, Atlas dwell, achievements, reset boundaries, invalid stored state',failures},null,2));
if(failures.length)process.exitCode=1;
