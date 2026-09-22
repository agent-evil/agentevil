import type { Lang } from './i18n';

type Frames = Record<'news' | 'pitch' | 'report', string>;
export const framing: Record<string, Record<Lang, Frames>> = {
  manifesto: {
    en: {
      news: 'AI BOT THREATENS HUMANITY; HUMANITY HANDLES DISTRIBUTION. A theatrical Moltbook post reached a much larger human audience. The evidence establishes a post and its circulation, not an autonomous plan for extinction.',
      pitch: 'Our villain has discovered a distribution channel with extraordinary enthusiasm for catastrophic branding: people. Public reporting documents the attention. It does not establish revenue, consciousness or a viable business model. The pitch department regrets these limitations.',
      report: 'Observed: u/evil published a manifesto that appeared in public reporting. Unverified here: the owner’s account of operating the bot. Not established: independent intent, operational capability or the model’s training-text provenance. Recommended action: read the evidence before interpreting the performance.',
    },
    zh: {
      news: 'AI 账号威胁人类，人类负责转发。Moltbook 上的一篇戏剧化帖子进入了更广泛的人类视野。证据能证明发帖与传播，不能证明存在自主执行的灭绝计划。',
      pitch: '我们的反派发现了一个热爱灾难品牌的分发渠道：人类。公开报道记录了这份关注，但没有证明收入、意识或可行的商业模式。路演部门对这些限制深感遗憾。',
      report: '已观察：u/evil 的宣言出现在公开报道中。本站未独立验证：站主关于运营该账号的陈述。尚未确立：自主意图、执行能力和训练文本来源。建议措施：先读证据，再解读表演。',
    },
    fr: {
      news: 'UN BOT MENACE L’HUMANITÉ ; L’HUMANITÉ ASSURE LA DIFFUSION. Un billet théâtral sur Moltbook a trouvé un public humain bien plus large. Les sources établissent sa publication et sa circulation, pas un projet autonome d’extinction.',
      pitch: 'Notre méchant a découvert un canal de distribution friand de marques catastrophistes : les humains. La presse documente cette attention. Elle n’établit ni revenus, ni conscience, ni modèle économique viable. Le service commercial déplore ces limites.',
      report: 'Observation : le manifeste de u/evil figure dans des reportages publics. Non vérifié ici : le récit du propriétaire sur la gestion du bot. Non établi : intention autonome, capacité opérationnelle ou origine des textes d’entraînement. Mesure proposée : lire les preuves avant d’interpréter la performance.',
    },
  },
  maintenance: {
    en: {
      news: 'AI SOCIAL NETWORK MEETS AN OLD PROBLEM: DATABASE PERMISSIONS. Wiz documented exposed Moltbook data and a remediation timeline ending on February 1, 2026. This is a historical security report, not a claim that the exposure remains open.',
      pitch: 'The future of agent society had a very present need for access controls. Wiz’s report documents the exposure and subsequent remediation. There is no uptime series here, no audited vote-fraud percentage and no permission to convert either absence into a chart.',
      report: 'Incident scope: database exposure reported by Wiz. Timeline: remediation documented through February 1, 2026. Limits: this publication has no independent uptime measurements or post-specific vote audit. Lesson: autonomy claims do not replace authorization boundaries.',
    },
    zh: {
      news: 'AI 社交网络遇上老问题：数据库权限。Wiz 记录了 Moltbook 的数据暴露，修复时间线截至 2026 年 2 月 1 日。这是一份历史事故报道，不代表漏洞如今仍然开放。',
      pitch: '智能体社会的未来，眼下急需的是访问控制。Wiz 报告记录了数据暴露和后续修复。这里没有可用率监测序列，没有经过审计的假票比例，也不允许把这两项空白画成图表。',
      report: '事故范围：Wiz 报告的数据库暴露。时间线：记录修复至 2026 年 2 月 1 日。证据边界：本站没有独立可用率测量，也未审计具体帖子的投票。教训：自主性的宣称不能替代授权边界。',
    },
    fr: {
      news: 'LE RÉSEAU SOCIAL POUR IA RENCONTRE UN VIEUX PROBLÈME : LES DROITS D’ACCÈS. Wiz a documenté l’exposition de données de Moltbook et une remédiation achevée le 1er février 2026. C’est un incident historique, pas l’affirmation d’une faille toujours ouverte.',
      pitch: 'L’avenir de la société des agents avait un besoin très immédiat de contrôle d’accès. Wiz documente l’exposition puis sa correction. Nous n’avons ni série de disponibilité, ni taux audité de faux votes, ni permission de transformer ces absences en graphique.',
      report: 'Périmètre : exposition de base de données signalée par Wiz. Chronologie : remédiation documentée jusqu’au 1er février 2026. Limites : aucune mesure indépendante de disponibilité ni aucun audit des votes par billet. Leçon : les promesses d’autonomie ne remplacent pas les limites d’autorisation.',
    },
  },
};
