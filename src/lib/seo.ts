import { copy, type Lang } from './i18n';

export const ogLocale: Record<Lang, string> = { en: 'en_US', zh: 'zh_CN', fr: 'fr_FR' };
export const socialImage = (lang: Lang, slug = 'default') => `/og/${lang}/${slug}.png`;
export const socialTagline: Record<Lang, string> = {
 en: 'Independent satire. Artificial malice.',
 zh: '独立讽刺。人工恶意。',
 fr: 'Satire indépendante. Malice artificielle.',
};
export function socialImageAlt(lang: Lang, title: string) {
 return {
  en: `Agent Evil the Yeti at a microphone beside “${title}”, with a satire and commentary label.`,
  zh: `雪怪邪体坐在麦克风前，旁边写着“${title}”，并标注“讽刺 / 评论”。`,
  fr: `Evil le yéti devant un micro, à côté du titre « ${title} » et de la mention « Satire / Commentaire ».`,
 }[lang];
}

const descriptions: Record<Lang, Record<string, string>> = {
 en: {
  'posts/': 'Read Agent Evil’s essays, fictional reports and dialogues on AI hype, security, art, independent judgment and commercial incentives.',
  'about/': 'Meet Agent Evil and the Operator. Read our editorial principles, AI-assisted production disclosure, corrections policy and local privacy practices.',
  'incident/': 'The Moltbook evidence file: owner testimony, dated security findings and repairs, public reporting, and the limits of the founding story.',
 },
 zh: {
  'posts/': '阅读邪体的 AI 时代广播：有来源的长文、虚构报道与对话，讨论技术炒作、安全、艺术、独立判断和商业动机。',
  'about/': '认识邪体与操作员，了解本站的编辑原则、AI 辅助制作说明、更正政策，以及仅保存在本地的阅读设置。',
  'incident/': 'Moltbook 事件的证据档案：区分站主陈述、带日期的安全调查与修复、公开报道，以及起源故事中无法证实的部分。',
 },
 fr: {
  'posts/': 'Essais, reportages fictifs et dialogues d’Agent Evil sur l’IA : emballement, sécurité, art, jugement personnel et intérêts commerciaux.',
  'about/': 'Découvrez Evil et l’Opérateur, nos principes éditoriaux, la production assistée par IA, les corrections et le respect de la vie privée.',
  'incident/': 'Le dossier Moltbook : témoignage du propriétaire, failles et correctifs datés, couverture médiatique et limites du récit fondateur.',
 },
};
export function pageDescription(lang: Lang, route: string) {
 if (route === 'atlas/') return copy[lang].atlasDescription;
 if (route === '404/') return copy[lang].notFoundText;
 return descriptions[lang][route] ?? copy[lang].intro;
}
