import { chromium, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://localhost:4322';
const keyboardOnly = process.env.A11Y_KEYBOARD_ONLY === '1';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const failures: string[] = [];
const checks: string[] = [];
const assert = (condition: unknown, label: string) => { if (!condition) failures.push(label); };
async function axe(page: Page, label: string) {
 const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 for (const issue of result.violations) failures.push(`${label}: ${issue.id}: ${issue.nodes.map(node=>node.target.join(' ')).join(', ')}`);
 checks.push(`axe: ${label}`);
}
async function focused(page: Page, label: string) {
 const result = await page.evaluate(() => {
  const element = document.activeElement as HTMLElement;
  const style = getComputedStyle(element);
  // Wrapped inline links have separate line fragments; their bounding-box center can be empty space.
  const visible=Array.from(element.getClientRects()).some(rect=>{
   const left=Math.max(0,rect.left), right=Math.min(innerWidth,rect.right), top=Math.max(0,rect.top), bottom=Math.min(innerHeight,rect.bottom);
   const hit=right>left&&bottom>top ? document.elementFromPoint((left+right)/2,(top+bottom)/2) : null;
   return rect.width>0&&rect.height>0&&!!hit&&(hit===element||element.contains(hit));
  });
  return {tag:element.tagName, visible, ring:element.matches(':focus-visible')&&(parseFloat(style.outlineWidth)>0||style.boxShadow!=='none'), name:element.getAttribute('aria-label')||element.textContent?.trim().slice(0,60)};
 });
 assert(result.visible,`${label}: focus hidden or obscured (${result.tag}: ${result.name})`);
 assert(result.ring,`${label}: missing visible keyboard focus (${result.tag}: ${result.name})`);
}
async function tabTo(page: Page, selector: string, label: string) {
 for (let count=0; count<100; count++) {
  if (await page.locator(selector).first().evaluate(element=>element===document.activeElement)) {await focused(page,label);return;}
  await page.keyboard.press('Tab');
 }
 throw new Error(`${label}: control unreachable with Tab`);
}
async function traversePage(page: Page, label: string) {
 for (const direction of ['Tab','Shift+Tab']) {
  let visited=0;
  for (let i=0;i<150;i++) {
   await page.keyboard.press(direction);
   if (await page.evaluate(()=>document.activeElement===document.body)) break;
   await focused(page,`${label} ${direction} ${i}`);
   visited++;
  }
  assert(visited>0&&visited<150,`${label}: page ${direction} traversal must remain reachable without a trap`);
 }
 checks.push(`Page Tab order: ${label}`);
}
try {
 for (const width of [360,1440]) {
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror',error=>failures.push(`JavaScript: ${error.message}`));
  for (const prefix of ['','/zh','/fr']) {
   for (const route of keyboardOnly ? [] : ['/','/posts/','/posts/manifesto/','/posts/think-for-yourself/','/atlas/','/atlas/ai-alignment/','/about/','/incident/',prefix?'/404/':'/404.html']) {
    await page.goto(base+prefix+route,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await axe(page,`${width} ${prefix+route}`);
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${width} ${prefix+route}: horizontal overflow`);
    await traversePage(page,`${width} ${prefix+route}`);
   }
   await page.goto(base+prefix+'/posts/manifesto/',{waitUntil:'networkidle'});
   await page.keyboard.press('Tab');
   assert(await page.locator('.skip-link').evaluate(element=>element===document.activeElement),'Skip link is first Tab stop');
   await focused(page,'Skip link');
   await page.keyboard.press('Enter');
   assert(await page.locator('#main').evaluate(element=>element===document.activeElement),'Skip link moves focus into main');
   await page.reload({waitUntil:'networkidle'});
   await tabTo(page,'[data-language-menu] summary','Language control');
   await page.keyboard.press('Enter');
   await page.keyboard.press('Tab');
   assert(await page.evaluate(()=>!!document.activeElement?.closest('.language-options')),'Tab enters expanded language choices');
   await focused(page,'Language choice');
   await page.keyboard.press('Escape');
   assert(await page.locator('[data-language-menu] summary').evaluate(element=>element===document.activeElement),'Language Escape restores summary');
   await page.keyboard.press('Enter');
   await page.keyboard.press('Tab');
   await page.keyboard.press('Alt+e');
   await page.locator('dialog').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-language-menu] summary'));
   assert(await page.locator('[data-language-menu] summary').evaluate(element=>element===document.activeElement),'Alt+E from a language choice restores the visible language control');
   await page.keyboard.press('Enter');
   for (let i=0;i<4;i++) await page.keyboard.press('Tab');
   assert(await page.locator('[data-language-menu]').getAttribute('open')===null,'Tab out closes language popover');
   await tabTo(page,'[data-open-console]','Console trigger');
   await page.keyboard.press('Enter');
   await page.locator('dialog').waitFor({state:'visible'});
   await page.locator('dialog').evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));
   if (!keyboardOnly) await axe(page,`${width} ${prefix} console`);
   const controls=await page.locator('dialog button:visible, dialog a:visible, dialog select:visible').count();
   for (const direction of ['Tab','Shift+Tab']) for(let i=0;i<controls+2;i++) {
    await page.keyboard.press(direction);
    assert(await page.evaluate(()=>!!document.activeElement?.closest('dialog')),`${direction}: modal contains focus`);
    await focused(page,`${width} ${prefix} console ${direction} ${i}`);
   }
   await page.keyboard.press('Escape');
   assert(await page.locator('[data-open-console]').evaluate(element=>element===document.activeElement),'Console Escape restores trigger');
   if (width===360) {
    await tabTo(page,'.evil-note summary','Mobile Evil disclosure');
    await page.keyboard.press('Enter');
    assert(await page.locator('.evil-note').first().getAttribute('open')!==null,'Mobile notes expand with Enter');
   }
   await page.goto(base+prefix+'/atlas/',{waitUntil:'networkidle'});
   await tabTo(page,'input[type="search"]','Atlas search');
   await page.keyboard.type('zzzznotfound');
   await page.locator('[data-search-empty]').waitFor({state:'visible'});
   await tabTo(page,'[data-clear-search]','Clear search');
   await page.keyboard.press('Enter');
   assert(await page.locator('input[type="search"]').evaluate(element=>element===document.activeElement),'Clear search restores search focus');
   assert(await page.locator('[data-atlas-card]:visible').count()===25,'Keyboard clear restores all Atlas entries');
   checks.push(`Keyboard: ${width} ${prefix||'/'} skip, language, full modal forward/reverse loop, Escape, notes and search`);
   console.log(`Completed accessibility and keyboard checks: ${width}px ${prefix||'en'}`);
  }
  await context.close();
 }
} catch(error) {failures.push(String(error));}
finally {await browser.close();}
await mkdir('test-results',{recursive:true});
await writeFile(`test-results/${keyboardOnly?'keyboard':'a11y'}-report.json`,JSON.stringify({base,checks,failures},null,2));
console.log(JSON.stringify({checks:checks.length,failures},null,2));
if(failures.length) process.exitCode=1;
