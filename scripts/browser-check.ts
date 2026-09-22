import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://localhost:4322';
const output = 'test-results';
await mkdir(output,{recursive:true});
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const failures: string[] = [];
const checked: string[] = [];
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await context.newPage();
page.setDefaultTimeout(12000);
page.on('pageerror',error => failures.push(`Browser error: ${error.message}`));
page.on('response',response => {if (response.status()>=400 && response.url().startsWith(base)) failures.push(`HTTP ${response.status()}: ${response.url()}`);});
function assert(value: unknown, message: string) {if (!value) failures.push(message);}
async function visit(route: string, target=page) {
 await target.goto(base+route,{waitUntil:'networkidle'});
 await target.evaluate(() => document.fonts.ready);
}
async function overflow(label: string) {
 const bad = await page.evaluate(() => document.documentElement.scrollWidth>innerWidth+1);
 assert(!bad,`${label}: horizontal overflow`);
}
async function accessibility(label: string) {
 const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 for (const violation of result.violations) failures.push(`${label}: axe ${violation.id} ${violation.nodes.slice(0,3).map(node=>node.target.join(' ')).join(', ')}`);
}
async function openConsole() {await page.locator('[data-open-console]').click(); await page.locator('dialog').waitFor({state:'visible'}); await page.locator('dialog').evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));}
try {
 await visit('/');
 assert(!await page.locator('dialog').isVisible(),'No automatic boarding');
 assert(await page.locator('[data-github-link]').getAttribute('href')==='https://github.com/agent-evil/agentevil','Owner GitHub link');
 await page.locator('[data-toggle-lights]').click();
 assert(await page.locator('html').getAttribute('data-mode')==='light','Topbar switches to light');
 await page.reload({waitUntil:'networkidle'});
 assert(await page.locator('html').getAttribute('data-mode')==='light','Topbar lighting persists');
 await page.locator('[data-toggle-lights]').click();
 assert(await page.locator('html').getAttribute('data-mode')==='dark','Topbar switches to dark');
 await page.locator('[data-language-menu] summary').click();
 await accessibility('Expanded language menu');
 await page.keyboard.press('Escape');
 assert(await page.locator('[data-language-menu] summary').evaluate(element=>element===document.activeElement),'Language menu Escape returns focus');
 assert(await page.locator('[data-language-menu]').getAttribute('open')===null,'Language menu Escape closes');
 await visit('/posts/manifesto/');
 await page.locator('[data-language-menu] summary').click();
 await page.locator('[data-language-menu] a[lang="zh-CN"]').click();
 assert(page.url()===base+'/zh/posts/manifesto/','Topbar language preserves article route');
 await page.locator('[data-language-menu] summary').click();
 await page.locator('h1').click();
 assert(await page.locator('[data-language-menu]').getAttribute('open')===null,'Language menu closes outside');
 await visit('/');
 checked.push('Topbar icons: GitHub, persistent light/dark, accessible route-preserving language menu');
 await openConsole();
 await page.keyboard.press('Escape');
 assert(await page.locator('[data-open-console]').evaluate(element=>element===document.activeElement),'Console returns focus');
 await page.keyboard.press('Alt+e');
 assert(await page.locator('dialog').isVisible(),'Alt+E opens console');
 assert(await page.locator('[data-trophy="shortcut"]').getAttribute('data-unlocked')==='true','Shortcut achievement');
 await page.locator('[data-close-console]').focus();
 await page.keyboard.press('Shift+Tab');
 assert(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),'Dialog traps reverse tab');
 await page.locator('[data-theme-choice="cartoon"]').click();
 await page.locator('[data-light-choice="light"]').click();
 await page.locator('[data-mute]').click();
 await page.locator('[data-mute]').click();
 assert(await page.locator('[data-trophy="coward"]').getAttribute('data-unlocked')==='true','Quick unmute achievement');
 await page.locator('[data-start-boarding]').click();
 await page.locator('#character').selectOption('intern');
 await page.locator('[data-boarding] button[type="submit"]').click();
 await page.locator('[data-start-boarding]').click();
 await page.locator('#character').selectOption('roomba');
 await page.locator('[data-boarding] button[type="submit"]').click();
 assert(await page.locator('[data-trophy="shortcut"]').getAttribute('data-unlocked')==='true','New Game+ retains achievements');
 await page.reload({waitUntil:'networkidle'});
 assert(await page.locator('html').getAttribute('data-theme')==='cartoon','Theme persists');
 await openConsole();
 assert((await page.locator('[data-greeting]').textContent())?.includes('Roomba'),'Character persists');
 await page.locator('[data-light-choice="system"]').click();
 await page.emulateMedia({colorScheme:'dark'});
 await page.waitForFunction(()=>document.documentElement.dataset.mode==='dark');
 assert(await page.locator('html').getAttribute('data-mode')==='dark','System dark mode');
 await page.emulateMedia({colorScheme:'light'});
 await page.waitForFunction(()=>document.documentElement.dataset.mode==='light');
 assert(await page.locator('html').getAttribute('data-mode')==='light','System light mode');
 await page.keyboard.press('Escape');
 checked.push('Console, focus, keyboard, persistence, registration, New Game+, system lighting');
 console.log('Console and persistence checks complete.');

 for (const prefix of ['','/zh','/fr']) {
  await visit(`${prefix}/atlas/`);
  assert(await page.locator('[data-atlas-card]').count()===25,`${prefix}: 25 entries`);
  await page.locator('input[type="search"]').fill('e/acc');
  assert(Number(await page.locator('[data-result-count]').textContent())>0,`${prefix}: search matches`);
  await page.locator('input[type="search"]').fill('zzzzzznonexistent');
  assert(await page.locator('[data-search-empty]').isVisible(),`${prefix}: empty search`);
  await page.locator('[data-clear-search]').click();
  await page.locator('select[name="category"]').selectOption('safety');
  assert(await page.locator('[data-atlas-card]:visible').count()===3,`${prefix}: category filter`);
  await accessibility(`${prefix}/atlas/`);
  await visit(`${prefix}/posts/manifesto/`);
  assert(await page.locator('.evil-anchor').count()===4,`${prefix}: four notes`);
  await openConsole();
  for (const lens of ['news','pitch','report']) await page.locator(`[data-lens-choice="${lens}"]`).click();
  assert(await page.locator('[data-trophy="framing"]').getAttribute('data-unlocked')==='true','Framing achievement');
  for (const planet of ['earth','moon','mars','sun','rogue']) await page.locator(`[data-planet-choice="${planet}"]`).click();
  assert(await page.locator('[data-trophy="planets"]').getAttribute('data-unlocked')==='true','Planet achievement');
  assert(await page.locator(`dialog a[href="${prefix || ''}/posts/manifesto/"]`).count()===1,'Language retains canonical article');
  await page.keyboard.press('Escape');
  assert(await page.locator('[data-frame="report"]').isVisible(),'Framing opening visible');
  await visit(`${prefix}/posts/think-for-yourself/`);
  const bodyLang = prefix === '/zh' ? 'zh-CN' : prefix === '/fr' ? 'fr' : 'en';
  assert(await page.locator('.prose').getAttribute('lang')===bodyLang,`${prefix || '/en'}: body language ${bodyLang}`);
  assert(await page.locator('aside.notice').count()===0,`${prefix || '/en'}: translated body has no English notice`);
  await openConsole();
  assert((await page.locator('[data-lens-feedback]').textContent())!.length>0,'Unsupported framing feedback');
  await page.keyboard.press('Escape');
 }
 checked.push('Trilingual search, filters, empty state, 25 entries, translated body language, framing and planets');
 console.log('Trilingual content and Atlas checks complete.');

 for (const width of [360,1440]) {
  await page.setViewportSize({width,height:1000});
  for (const theme of ['terminal','broadsheet','cartoon','dossier']) for (const mode of ['light','dark']) {
   await visit('/posts/manifesto/'); await openConsole();
   await page.locator(`[data-theme-choice="${theme}"]`).click();
   await page.locator(`[data-light-choice="${mode}"]`).click();
   await accessibility(`${width}/${theme}/${mode}/console`);
   await page.keyboard.press('Escape');
   await page.evaluate(()=>document.fonts.ready);
   await overflow(`${width}/${theme}/${mode}/article`);
   await accessibility(`${width}/${theme}/${mode}/article`);
   const noteOpen = await page.locator('.evil-note').first().getAttribute('open');
   assert(width===360 ? noteOpen===null : noteOpen!==null,`${width}: correct note disclosure`);
   if (width===360) {await page.locator('.evil-note summary').first().click(); assert(await page.locator('.evil-note-text').first().isVisible(),'Mobile note expands');}
   else {
    const boxes = await page.locator('.evil-anchor').evaluateAll(notes=>notes.map(note=>{const rect=note.getBoundingClientRect();return {top:rect.top,bottom:rect.bottom,left:rect.left};}));
    assert(boxes.every((box,index)=>!index||box.top>=boxes[index-1].bottom),`${theme}: notes do not collide`);
   }
   await page.screenshot({path:`${output}/article-${width}-${theme}-${mode}.png`,fullPage:true});
   for (const prefix of ['','/zh','/fr']) {
    await visit(`${prefix}/`); await overflow(`${width}/${theme}/${mode}/${prefix}/home`);
    await accessibility(`${width}/${theme}/${mode}/${prefix}/home`);
    if (!prefix) await page.screenshot({path:`${output}/home-${width}-${theme}-${mode}.png`});
   }
   checked.push(`${width}px ${theme} ${mode}: article, console, EN/ZH/FR home`);
   console.log(`Checked ${width}px ${theme} ${mode}.`);
  }
 }

 await page.setViewportSize({width:360,height:800});
 await visit('/posts/manifesto/');
 const censor = page.locator('[data-censored]').first();
 if (await censor.count()) {
  await censor.scrollIntoViewIfNeeded();
  for (let index=0;index<10;index++) await censor.click();
  await page.keyboard.press('Escape');
  assert(!await censor.locator('.censor-tip').isVisible(),'Censor tooltip dismisses');
  await openConsole(); assert(await page.locator('[data-trophy="mosaic"]').getAttribute('data-unlocked')==='true','Mosaic achievement'); await page.keyboard.press('Escape');
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 assert(await page.locator('.mosaic').first().evaluate(element=>getComputedStyle(element,'::after').animationName)==='none','Reduced motion disables mosaic animation');
 await visit('/posts/maintenance/');
 const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}});
 const fallback = await noJS.newPage();
 await visit('/zh/posts/manifesto/',fallback);
 assert(await fallback.locator('.prose').innerText().then(text=>text.length>1000),'No-JS full article');
 assert(await fallback.locator('.evil-note[open]').count()===4,'No-JS notes readable');
 await fallback.locator('[data-language-menu] summary').click();
 await fallback.locator('[data-language-menu] a[lang="fr"]').click();
 assert(fallback.url()===base+'/fr/posts/manifesto/','No-JS native language menu');
 await visit('/fr/atlas/',fallback);
 assert(await fallback.locator('[data-atlas-card]:visible').count()===25,'No-JS full Atlas');
 await noJS.close();
 const blocked = await browser.newContext();
 await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
 const blockedPage=await blocked.newPage(); await visit('/',blockedPage);
 await blockedPage.locator('[data-open-console]').click(); await blockedPage.locator('[data-theme-choice="broadsheet"]').click();
 assert(await blockedPage.locator('html').getAttribute('data-theme')==='broadsheet','Storage failure still allows settings');
 await blocked.close();
 checked.push('Mosaics, reduced motion, no-JS reading/search listing and blocked storage');
} catch (error) {failures.push(String(error));}
finally {await browser.close();}
await writeFile(`${output}/browser-report.json`,JSON.stringify({base,checked,failures},null,2));
console.log(JSON.stringify({checks:checked.length,failures},null,2));
if (failures.length) process.exitCode=1;
