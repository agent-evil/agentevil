# Agent Evil: product brief

## Product and editorial identity

Build `agentevil.com` as a striking, readable satire publication about the AI era, with a serious AI Ideology Atlas and an optional interactive-fiction layer. The unifying metaphor is Agent Evil's pirate broadcast terminal. The articles are the broadcast, the Atlas is the archive, and settings are equipment on a passenger console.

The editorial position is independent judgment: apply consistent evidential standards to hype, fear, commercial incentives, dependency and the publication itself. Do not require equal criticism of every side or assume the midpoint is true. Respect concrete concerns about security, privacy, labor and creator consent. Satire should target unsupported claims, abandoned judgment, rhetorical shortcuts and incentives.

Moltbook and the owner's u/evil bot are the founding incident, not the entire subject. Separate owner testimony, verified public reporting and fictional narration. Never invent uptake, fake-vote percentages, uptime measurements, quotations, media endorsements or training-data provenance. Historical security incidents must include their resolution and time bounds.

Agent Evil is a vain, slightly evil but endearing **Yeti**, nicknamed 邪体 in Chinese, a wordplay based on the abbreviation for evil intelligent agent. He wants to be feared, hates having his worst writing quoted, has oddly professional standards and occasionally admits the Operator is right. The Operator is the anonymous human narrative voice, not an infallible referee. Production credits must distinguish these personas from actual AI-assisted drafting and implementation.

## Content

Launch six complete English pieces, roughly 600–1100 words, mixing sourced essays, fictional reports, a rejection letter and dialogue. All six have full Simplified Chinese and French translations. A reusable English-body notice remains for any future article that lacks a translation. All UI and static site content must be localized.

The six topics are the manifesto's publicity, the historical Moltbook security incident, outsourcing independent thought, judging art by provenance labels, vendor pricing and mission rhetoric, and prompt injection in agent workflows. There are four useful Evil notes per existing draft. Do not pad with lore or require every paragraph to make a joke.

MDX content uses typed collections. The two-voice format anchors inline-authored Evil asides to paragraphs. Desktop notes sit in a right rail and resolve collisions by pushing down. Mobile uses tappable native details chips. No-JS fallback remains readable. Muting Evil hides article notes and his independent Atlas/home comments.

An inline Censored component never stores or outputs the hidden profanity, takes only a size, and displays a small animated mosaic. Hover, keyboard focus or tap rotates absurd fake decodings. Use ten localized responses, accessible labeling and reduced-motion support. Dossier uses black redaction blocks.

## AI Ideology Atlas

At least 24 substantive trilingual entries; 25 drafts now exist. Cover ten categories: pace, capability forecasts, safety, governance, openness, labor, culture, human-machine relations, material resources and discourse. Distinguish movements, research fields, policies, concepts, external labels and the publication's own stance.

Each entry supplies definition, strongest supporting argument, objections and internal differences, independently labeled Evil commentary, primary-source links, review date, related entries and related articles. Search and category filtering work locally, with count and empty state. All entries remain accessible without JS. Do not place people on a made-up numerical political scale. Sources and definitions must remain useful when jokes are muted.

## Design

Editorial-first: oversized, compressed masthead, asymmetric lead story, sophisticated risograph/linocut Yeti illustration, generous whitespace, fine rules and controlled typography. The lead immediately stages the human/machine dialogue. Avoid generic equal-card grids, dashboard metrics, glassmorphism, neon-green hacker clichés, purple gradients and mandatory onboarding.

The four themes share information architecture and have distinct art direction:

1. Terminal: charcoal, ivory and restrained gold; Barlow Condensed display, Public Sans body, IBM Plex Mono utility. Signature: giant masthead and print illustration.
2. Broadsheet: cool paper, dark ink and forest accent; Newsreader serif with mono utility. Signature: literary double-rule masthead.
3. Saturday Morning: chalk, dark ink and disciplined gold/yellow; Fredoka display and Public Sans body. Signature: outlined speech box with hard shadow.
4. Classified: green-grey paper, deep ink and sage stamp; IBM Plex Mono display and Public Sans body. Signature: one classification stamp and redaction bars.

Each supports light/dark modes. Fonts are self-hosted. Maintain a 65–72ch reading measure, visible focus, AA contrast and a working 360px layout. Reduced motion must disable animation. Use actual browser verification before claiming quality. No fake registered-trademark claim.

## Reality Console

The owner's latest direction puts icon-only language and light/dark shortcuts directly in the header, plus a GitHub icon linking to https://github.com/agent-evil/agentevil and the Reality Console icon. Preserve brand, Posts, Atlas and About. Language switches retain the current route. The console remains a native dialog with keyboard focus containment, Escape closing, return focus and scrollable mobile layout. No red dots, red sun/disc imagery or red branding punctuation; use the monochrome Yeti asset.

Equipment has ordinary functional labels plus fictional names:

- Wardrobe: four themes.
- Universal Translator: EN / ZH / FR; preserve article or entry when switching.
- Ship Lights: light, dark, system.
- Framing Goggles: original, news headline, investor pitch, incident report. Only the two lead pieces get short authored alternate openings; full facts stay intact. Unsupported pages give a localized explanation.
- Telescope: Earth, Moon, Mars, Sun, rogue planet. Only dateline, subtle ambience and footer coordinates change.
- Tinfoil Hat: hide Evil comments.

Validate and persist state in localStorage, with graceful storage failure. Inline head script applies theme before paint. URL determines language. No automatic redirect based on guessed language.

## Optional fiction

No first-visit interruption. Passenger registration is offered only within the voluntarily opened console. Five characters affect greetings only: laid-off journalist, safety intern, bankrupt VC, retired Roomba, ordinary person. Skip is immediate. New Game+ reselects a character without losing achievements.

Eight local achievements: finish three articles, tap ten mosaics, use all three framing variants on one flagship, find Alt+E, visit all five locations, mute then unmute within ten seconds, read five Atlas entries, try all four themes. Reading completion needs an end-of-content observation and minimum dwell. No content gates, leaderboards, backend or personal tracking. Toasts do not steal focus. Explain local reset clearly.

## Engineering and release

Use Bun 1.4.2 with its lockfile, Astro 7.3.3 static output, strict TypeScript, MDX collections, vanilla CSS layers and small vanilla-TS enhancements. No React or Tailwind. English code/comments/docs; product content is trilingual. The owner's detailed Chinese `PROMPT.md` is local and gitignored.

Native Astro i18n: `/`, `/zh/`, `/fr/`. Shared route helpers, correct language attributes, canonical and hreflang tags. RSS per language, sitemap, 404, Article metadata, robots and static branded OG images with satire labeling.

Giscus must be a working configurable scaffold, lazy loaded, with theme/language synchronization and honest disconnected UI until repository IDs are configured. Include an English `SETUP-GISCUS.md`.

Target <=50 KB gzipped JS per page, excluding giscus; count inline script too. Theme directory includes an English extension guide. No nonexistent visible features, false form submissions or invented test results.

Cloudflare Pages static deployment, `wrangler.toml`, security/cache headers and GitHub Actions. PRs validate. Main deploys only after checks pass, using the validated artifact. Credentials stay in GitHub secrets. The domain must actually be configured before claiming production availability.

Acceptance requires actual successful type checks, build, internal-link validation, browser interaction checks at mobile/desktop and all themes/modes, and measured Lighthouse performance/accessibility/SEO aiming at 95+. Record limitations honestly. See docs/VERIFICATION.md for completed checks and remaining external integrations.
