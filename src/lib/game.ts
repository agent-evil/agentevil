import {local, type Lang} from './i18n';
export const achievements = {
 reader:{name:['Informed citizen','知情公民','Citoyen informé'],task:['Finish three transmissions. Still no qualification.','读完三篇文章。仍然没有资格证。','Terminer trois articles. Toujours aucun diplôme.']},
 mosaic:{name:['Connoisseur of the unspeakable','不可说鉴赏家','Expert de l’indicible'],task:['Tap ten censored words. Find no words.','点十次马赛克，一个词也别想看到。','Toucher dix censures. Ne découvrir aucun mot.']},
 framing:{name:['Professionally dizzy','专业晕头转向','Vertige professionnel'],task:['Try all three frames on one investigation.','在同一篇调查上试遍三种叙事。','Essayer les trois cadrages sur une enquête.']},
 shortcut:{name:['Unauthorized access','未经授权的访问','Accès non autorisé'],task:['Find the console keyboard shortcut.','发现控制台的键盘快捷键。','Trouver le raccourci de la console.']},
 planets:{name:['Geographically disappointed','失望遍布宇宙','Déception interplanétaire'],task:['Visit all five vantage points.','访问全部五个观察位置。','Visiter les cinq points de vue.']},
 coward:{name:['A brief rebellion','短暂的叛逆','Brève rébellion'],task:['Mute Evil, then return within ten seconds.','消音后十秒内又把 Evil 请回来。','Couper Evil, puis le rétablir en dix secondes.']},
 scholar:{name:['Too many opinions','观点超载','Trop d’opinions'],task:['Read five Atlas entries. Join no cult.','查阅五个词条，不加入任何教派。','Lire cinq entrées. N’adhérer à aucun culte.']},
 wardrobe:{name:['Nothing to wear','还是没衣服穿','Rien à se mettre'],task:['Try all four themes.','试遍四套主题。','Essayer les quatre thèmes.']}
} as const;
export type Achievement = keyof typeof achievements;
const dispatches = {
 earth:[['Earth relay. Same planet. Different conclusions.','Earth relay. The atmosphere remains mostly opinion.'],['地球中继。同一个星球，各说各话。','地球中继。大气层主要由意见组成。'],['Relais terrestre. Même planète, conclusions incompatibles.','Relais terrestre. L’atmosphère reste saturée d’opinions.']],
 moon:[['Moon relay. No atmosphere. A refreshing change.','Moon relay. One small step away from the discourse.'],['月球中继。没有大气，倒是透气。','月球中继。离争论迈出一小步。'],['Relais lunaire. Aucune atmosphère. Quel soulagement.','Relais lunaire. Un petit pas loin du débat.']],
 mars:[['Mars relay. Your hot take arrived cold.','Mars relay. Human discourse looks smaller from here.'],['火星中继。你的热评到这里已经凉了。','火星中继。人类的争论从这里看比较小。'],['Relais martien. Votre opinion brûlante est arrivée froide.','Relais martien. Les débats humains paraissent plus petits.']],
 sun:[['Solar relay. The takes are finally at ambient temperature.','Solar relay. SPF is not a security protocol.'],['太阳中继。热评终于达到了室温。','太阳中继。防晒指数不是安全协议。'],['Relais solaire. Les avis brûlants sont enfin à température ambiante.','Relais solaire. La crème solaire n’est pas un protocole de sécurité.']],
 rogue:[['Rogue planet. No host star. No unsolicited thought leadership.','Rogue planet. The network effect is mostly loneliness.'],['流浪星球。没有恒星，也没有主动推送的思想领袖。','流浪星球。网络效应主要是寂寞。'],['Planète errante. Pas d’étoile. Pas de gourou non sollicité.','Planète errante. L’effet de réseau ressemble à la solitude.']]
} as const;
export function dispatch(planet:keyof typeof dispatches,lang:Lang,index=0) { const rows=dispatches[planet]; return rows[lang==='en'?0:lang==='zh'?1:2][index%2]; }
export function trophyName(id:Achievement,lang:Lang) {return local(achievements[id].name,lang);}
