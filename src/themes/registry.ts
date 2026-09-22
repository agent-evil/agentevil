export const themes = [
 {id:'terminal',name:'EVIL://TERMINAL',swatch:'#d7bc68'},
 {id:'broadsheet',name:'The Broadsheet',swatch:'#365a44'},
 {id:'cartoon',name:'Saturday Morning',swatch:'#f6cb52'},
 {id:'dossier',name:'CLASSIFIED',swatch:'#4b6252'}
] as const;
export type ThemeId = typeof themes[number]['id'];
