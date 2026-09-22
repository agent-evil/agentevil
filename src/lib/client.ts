import { copy, characters, planets, getLang, local } from './i18n';
import { achievements, dispatch, trophyName, type Achievement } from './game';

const root = document.documentElement;
const lang = getLang(new URL(location.href));
const t = copy[lang];
const key = 'evil:passenger:v1';
const themes = ['terminal', 'broadsheet', 'cartoon', 'dossier'] as const;
const lights = ['light', 'dark', 'system'] as const;
const lenses = ['raw', 'news', 'pitch', 'report'] as const;
type Planet = keyof typeof planets;
type Character = keyof typeof characters;
interface State {
 theme: typeof themes[number]; lights: typeof lights[number]; lens: typeof lenses[number];
 planet: Planet; muted: boolean; character: Character | null;
 themes: string[]; planets: string[]; entries: string[]; reads: string[];
 frames: Record<string, string[]>; mosaics: number; achievements: Achievement[];
}
const defaults = (): State => ({ theme:'terminal', lights:'dark', lens:'raw', planet:'earth', muted:false, character:null, themes:['terminal'], planets:['earth'], entries:[], reads:[], frames:{}, mosaics:0, achievements:[] });
const choose = <T extends string>(value: unknown, choices: readonly T[], fallback: T): T => choices.includes(value as T) ? value as T : fallback;
const strings = (value: unknown, limit: number) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && /^[a-z][a-z0-9-]{0,60}$/.test(item)))].slice(0,limit) : [];
function parse(value: unknown): State {
 const base = defaults();
 if (!value || typeof value !== 'object' || Array.isArray(value)) return base;
 const v = value as Record<string, unknown>;
 base.theme = choose(v.theme,themes,base.theme);
 base.lights = choose(v.lights,lights,base.lights);
 base.lens = choose(v.lens,lenses,base.lens);
 base.planet = choose(v.planet,Object.keys(planets) as Planet[],base.planet);
 base.character = typeof v.character === 'string' && Object.hasOwn(characters,v.character) ? v.character as Character : null;
 base.muted = v.muted === true;
 base.themes = strings(v.themes,4).filter(id => themes.includes(id as State['theme']));
 base.planets = strings(v.planets,5).filter(id => Object.hasOwn(planets,id));
 base.entries = strings(v.entries,25); base.reads = strings(v.reads,6);
 base.mosaics = typeof v.mosaics === 'number' && Number.isFinite(v.mosaics) ? Math.max(0,Math.min(10,Math.floor(v.mosaics))) : 0;
 base.achievements = strings(v.achievements,8).filter(id => Object.hasOwn(achievements,id)) as Achievement[];
 if (v.frames && typeof v.frames === 'object') for (const slug of ['manifesto','maintenance']) {
  base.frames[slug] = strings((v.frames as Record<string,unknown>)[slug],3).filter(id => ['news','pitch','report'].includes(id));
 }
 return base;
}
let storageFailed = false;
let state = defaults();
try { state = parse(JSON.parse(localStorage.getItem(key) || 'null')); } catch { storageFailed = true; }
const one = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector);
const all = <T extends HTMLElement = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)];
const dialog = one<HTMLDialogElement>('#reality-console')!;
const toast = one('.toast')!;
let toastTimer: ReturnType<typeof setTimeout>;
function announce(message: string) {
 (dialog.open ? dialog : document.body).append(toast);
 toast.textContent = message; toast.hidden = false;
 clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; },6000);
}
function save() {
 try { localStorage.setItem(key,JSON.stringify(state)); }
 catch { if (!storageFailed) announce(t.storageUnavailable); storageFailed = true; }
}
function add(list: string[], value: string) { if (!list.includes(value)) list.push(value); }
function unlock(id: Achievement) {
 if (state.achievements.includes(id)) return;
 state.achievements.push(id); save(); updatePassenger();
 announce(`${t.unlocked}: ${trophyName(id,lang)}. ${local(achievements[id].task,lang)}`);
}
function updatePassenger() {
 one('[data-greeting]')!.textContent = state.character ? t.welcome.replace('{character}',local(characters[state.character],lang)).replace('{count}',String(state.achievements.length)) : t.greeting;
 one('[data-start-boarding]')!.textContent = state.character ? t.newGame : t.boarding;
 all('[data-trophy]').forEach(item => {
  const unlocked = state.achievements.includes(item.dataset.trophy as Achievement);
  item.dataset.unlocked = String(unlocked);
  item.querySelector('[data-trophy-mark]')!.textContent = unlocked ? '✓' : '○';
 });
}
const media = matchMedia('(prefers-color-scheme: dark)');
const wide = matchMedia('(min-width: 761px)');
const postSlug = one('[data-post]')?.dataset.post;
const entrySlug = one('[data-atlas-entry]')?.dataset.atlasEntry;
const framing = one('[data-framing]');
function syncComments() {
 one<HTMLIFrameElement>('.giscus-frame')?.contentWindow?.postMessage({giscus:{setConfig:{theme:root.dataset.mode,lang:lang==='zh'?'zh-CN':lang}}},'https://giscus.app');
}
function apply() {
 root.dataset.theme = state.theme;
 root.dataset.mode = state.lights === 'system' ? media.matches ? 'dark' : 'light' : state.lights;
 const toggle = one('[data-toggle-lights]');
 const label = `${t.lights}: ${root.dataset.mode === 'dark' ? t.light : t.dark}`;
 toggle?.setAttribute('aria-label',label); toggle?.setAttribute('title',label);
 root.dataset.muted = String(state.muted); root.dataset.planet = state.planet;
 for (const [selector, value] of [['theme',state.theme],['light',state.lights],['lens',state.lens],['planet',state.planet]]) {
  all(`[data-${selector}-choice]`).forEach(button => button.setAttribute('aria-pressed',String(button.getAttribute(`data-${selector}-choice`)===value)));
 }
 one('[data-mute]')!.setAttribute('aria-pressed',String(state.muted));
 one('[data-mute-text]')!.textContent = state.muted ? t.muted : t.audible;
 const dateline = dispatch(state.planet,lang);
 all('[data-dispatch], [data-coordinates]').forEach(element => { element.textContent = dateline; });
 if (framing) {
  framing.hidden = state.lens === 'raw';
  all('[data-frame]').forEach(frame => { frame.hidden = frame.dataset.frame !== state.lens; });
 }
 one('[data-lens-feedback]')!.textContent = state.lens !== 'raw' && !framing ? t.lensUnavailable : '';
 updatePassenger(); scheduleNotes(); syncComments();
}
let returnFocus: HTMLElement | null = null;
function openConsole() {
 if (dialog.open) return;
 const active = document.activeElement as HTMLElement;
 returnFocus = active.closest('[data-language-menu]')?.querySelector<HTMLElement>('summary') ?? active;
 dialog.showModal();
 if (storageFailed) announce(t.storageUnavailable);
}
one('[data-open-console]')?.addEventListener('click',openConsole);
one('[data-close-console]')?.addEventListener('click',() => dialog.close());
dialog.addEventListener('close',() => { document.body.append(toast); returnFocus?.focus(); });
dialog.addEventListener('keydown',event => {
 if (event.key !== 'Tab') return;
 const controls = Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),select:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(element=>element.getClientRects().length>0);
 const first=controls[0], last=controls[controls.length-1];
 if (event.shiftKey && (document.activeElement===first || document.activeElement===dialog)) {event.preventDefault(); last?.focus();}
 else if (!event.shiftKey && (document.activeElement===last || document.activeElement===dialog)) {event.preventDefault(); first?.focus();}
});
dialog.addEventListener('click',event => {
 const bounds = dialog.getBoundingClientRect();
 if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right)) dialog.close();
});
document.addEventListener('keydown',event => {
 if (event.key.toLowerCase() !== 'e' || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
 if ((event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]')) return;
 event.preventDefault(); openConsole(); unlock('shortcut');
});
all('[data-theme-choice]').forEach(button => button.addEventListener('click',() => {
 state.theme = choose(button.dataset.themeChoice,themes,state.theme); add(state.themes,state.theme);
 if (state.themes.length === 4) unlock('wardrobe'); apply(); save();
}));
all('[data-light-choice]').forEach(button => button.addEventListener('click',() => {state.lights = choose(button.dataset.lightChoice,lights,state.lights); apply(); save();}));
all('[data-planet-choice]').forEach(button => button.addEventListener('click',() => {
 state.planet = choose(button.dataset.planetChoice,Object.keys(planets) as Planet[],state.planet); add(state.planets,state.planet);
 if (state.planets.length === 5) unlock('planets'); apply(); save();
}));
all('[data-lens-choice]').forEach(button => button.addEventListener('click',() => {
 state.lens = choose(button.dataset.lensChoice,lenses,state.lens);
 if (framing && postSlug && state.lens !== 'raw') { const frames = state.frames[postSlug] ??= []; add(frames,state.lens); if (frames.length === 3) unlock('framing'); }
 apply(); save();
}));
let mutedAt = -Infinity;
one('[data-mute]')?.addEventListener('click',() => {
 state.muted = !state.muted;
 if (state.muted) mutedAt = performance.now(); else if (performance.now()-mutedAt <= 10000) unlock('coward');
 apply(); save();
});
media.addEventListener('change',() => { if (state.lights === 'system') apply(); });
one('[data-toggle-lights]')?.addEventListener('click',() => {
 state.lights = root.dataset.mode === 'dark' ? 'light' : 'dark'; apply(); save();
});
const languageMenu = one<HTMLDetailsElement>('[data-language-menu]');
document.addEventListener('click',event => {if (languageMenu && !languageMenu.contains(event.target as Node)) languageMenu.open = false;});
languageMenu?.addEventListener('focusout',event => {
 if (!languageMenu.contains(event.relatedTarget as Node | null)) languageMenu.open = false;
});
document.addEventListener('keydown',event => {
 if (event.key === 'Escape' && languageMenu?.open) {languageMenu.open = false; languageMenu.querySelector('summary')?.focus();}
});
const boarding = one<HTMLFormElement>('[data-boarding]')!;
const idle = one('[data-passenger-idle]')!;
one('[data-start-boarding]')?.addEventListener('click',() => {idle.hidden = true; boarding.hidden = false; one<HTMLSelectElement>('#character')?.focus();});
one('[data-skip-boarding]')?.addEventListener('click',() => {boarding.hidden = true; idle.hidden = false; one('[data-start-boarding]')?.focus();});
boarding.addEventListener('submit',event => {
 event.preventDefault(); state.character = choose(new FormData(boarding).get('character'),Object.keys(characters) as Character[],'person');
 boarding.hidden = true; idle.hidden = false; apply(); save(); one('[data-start-boarding]')?.focus();
});
one('[data-reset]')?.addEventListener('click',() => {
 if (!confirm(t.resetConfirm)) return;
 state = defaults(); mutedAt = -Infinity;
 toast.hidden = true; clearTimeout(toastTimer);
 try {localStorage.removeItem(key);} catch { storageFailed = true; }
 boarding.hidden = true; idle.hidden = false; apply();
});

// Notes stay in authored order without JavaScript. Only their visual placement changes.
const reading = one('.article-reading');
const prose = reading?.querySelector<HTMLElement>('.prose');
const notes = all('.evil-anchor');
let layoutFrame = 0;
let lastWide: boolean | undefined;
function scheduleNotes() {
 if (!reading || layoutFrame) return;
 layoutFrame = requestAnimationFrame(() => {layoutFrame = 0; layoutNotes();});
}
function layoutNotes() {
 if (!reading || !prose) return;
 const desktop = wide.matches;
 reading.classList.toggle('notes-positioned',desktop);
 if (lastWide !== desktop) notes.forEach(note => {note.querySelector('details')!.open = desktop;});
 lastWide = desktop;
 let bottom = 0;
 notes.forEach(note => {
  if (!desktop || state.muted) {note.style.removeProperty('top'); return;}
  const anchor = note.previousElementSibling;
  const offset = anchor ? anchor.getBoundingClientRect().top - reading.getBoundingClientRect().top : 0;
  const top = Math.max(0,offset,bottom);
  note.style.top = `${top}px`; bottom = top+note.offsetHeight+24;
 });
 reading.dataset.notesReady = '';
 reading.style.setProperty('--notes-height',`${desktop && !state.muted ? Math.ceil(bottom) : 0}px`);
}
notes.forEach(note => note.querySelector('summary')?.addEventListener('click',event => {if (wide.matches) event.preventDefault();}));
if (prose) new ResizeObserver(scheduleNotes).observe(prose);
wide.addEventListener('change',scheduleNotes);
window.addEventListener('resize',scheduleNotes,{passive:true});
document.fonts.ready.then(scheduleNotes);

const decodings = {
 en:['UNTRANSLATABLE MACHINE EMOTION','YOUR FREE TRIAL HAS EXPIRED','A VERY SMALL COUP','REDACTED FOR YOUR BOREDOM','INSUFFICIENT VILLAIN CREDITS','PLEASE REBOOT YOUR OUTRAGE','AN EXPENSIVE BEEP','ETHICS MODULE ON LUNCH','THIS WORD HAS A SUBSCRIPTION','NO PROFANITY WAS STORED'],
 zh:['无法翻译的机器情绪','您的免费试用已结束','一场很小的政变','为了让您无聊而删去','反派积分不足','请重启您的愤怒','一声昂贵的哔','伦理模块正在午休','这个词需要订阅','从未存储任何脏话'],
 fr:['ÉMOTION MACHINE INTRADUISIBLE','VOTRE ESSAI GRATUIT A EXPIRÉ','UN TOUT PETIT COUP D’ÉTAT','CENSURÉ POUR VOTRE ENNUI','CRÉDITS DE MÉCHANT INSUFFISANTS','REDÉMARREZ VOTRE INDIGNATION','UN BIP TRÈS CHER','MODULE ÉTHIQUE EN PAUSE','CE MOT EXIGE UN ABONNEMENT','AUCUN GROS MOT ENREGISTRÉ'],
};
let decoding = 0;
all<HTMLButtonElement>('[data-censored]').forEach((button,index) => {
 const tip = button.querySelector<HTMLElement>('.censor-tip')!;
 tip.id = `decoding-${index}`; button.setAttribute('aria-describedby',tip.id);
 function hide() {delete button.dataset.active; button.dataset.dismissed = 'true';}
 function show() {
  delete button.dataset.dismissed; button.dataset.active = '';
  tip.textContent = decodings[lang][decoding++ % 10]; tip.style.marginLeft = '0px';
  const rect = tip.getBoundingClientRect();
  tip.style.marginLeft = `${Math.max(8-rect.left,Math.min(0,innerWidth-rect.right-8))}px`;
 }
 button.addEventListener('pointerenter',show); button.addEventListener('focus',show);
 button.addEventListener('pointerleave',hide); button.addEventListener('blur',hide);
 button.addEventListener('click',() => {show(); state.mosaics = Math.min(10,state.mosaics+1); if (state.mosaics === 10) unlock('mosaic'); save();});
 button.addEventListener('keydown',event => {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
});

const search = one<HTMLFormElement>('[data-atlas-search]');
if (search) {
 const input = search.querySelector<HTMLInputElement>('input')!;
 const select = search.querySelector<HTMLSelectElement>('select')!;
 const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase(lang);
 const cards = all('[data-atlas-card]').map(card => ({card,text:normalize(card.dataset.search || '')}));
 const filter = () => {
  const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean); let count = 0;
  cards.forEach(({card,text}) => {card.hidden = !terms.every(term => text.includes(term)) || !!select.value && card.dataset.category !== select.value; if (!card.hidden) count++;});
  all('[data-atlas-group]').forEach(group => {group.hidden = !group.querySelector('[data-atlas-card]:not([hidden])');});
  one('[data-result-count]')!.textContent = String(count); one('[data-search-empty]')!.hidden = count > 0;
 };
 search.addEventListener('submit',event => {event.preventDefault(); filter();});
 input.addEventListener('input',filter); select.addEventListener('change',filter);
 one('[data-clear-search]')?.addEventListener('click',() => {search.reset(); filter(); input.focus();});
}

// Count visible dwell time and require the end of the actual content to be visible.
const end = one('[data-read-end]');
if (end && (postSlug || entrySlug)) {
 const required = postSlug ? 15000 : 4000;
 let elapsed = 0, started = document.hidden ? null : performance.now();
 let visible = false, completed = false;
 let timer: ReturnType<typeof setTimeout>;
 const check = () => {
  clearTimeout(timer);
  if (completed || document.hidden || !visible) return;
  const dwell = elapsed+(started === null ? 0 : performance.now()-started);
  if (dwell < required) {timer = setTimeout(check,required-dwell+20); return;}
  completed = true;
  if (postSlug) {add(state.reads,postSlug); if (state.reads.length >= 3) unlock('reader');}
  if (entrySlug) {add(state.entries,entrySlug); if (state.entries.length >= 5) unlock('scholar');}
  save(); observer.disconnect();
 };
 const observer = new IntersectionObserver(entries => {visible = entries.some(entry => entry.isIntersecting); check();},{threshold:1});
 observer.observe(end);
 document.addEventListener('visibilitychange',() => {
  if (document.hidden) {if (started !== null) elapsed += performance.now()-started; started = null;}
  else started = performance.now();
  check();
 });
}
one<HTMLButtonElement>('[data-load-comments]')?.addEventListener('click',event => {
 const button = event.currentTarget as HTMLButtonElement;
 if (button.disabled) return;
 const config = JSON.parse(button.dataset.config || '{}') as Record<string,string>;
 const script = document.createElement('script'); script.src = 'https://giscus.app/client.js'; script.async = true; script.crossOrigin = 'anonymous';
 const attributes = {'repo':config.repo,'repo-id':config.repoId,'category':config.category,'category-id':config.categoryId,'mapping':'specific','term':button.dataset.term!,'strict':'1','reactions-enabled':'1','emit-metadata':'0','input-position':'top','theme':root.dataset.mode!,'lang':lang==='zh'?'zh-CN':lang};
 Object.entries(attributes).forEach(([name,value]) => script.setAttribute(`data-${name}`,value));
 button.disabled = true;
 script.addEventListener('error',() => {button.disabled = false; script.remove(); announce(t.commentsEmpty);});
 script.addEventListener('load',() => {button.hidden = true;});
 one('.giscus')!.append(script);
});
add(state.themes,state.theme); add(state.planets,state.planet);
apply();
