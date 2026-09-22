# Implementation handoff

Last updated: 2026-09-22. The owner explicitly resumed development. The previous pause is no longer active.

## Current state

The site is live at https://agentevil.com and https://agentevil.pages.dev. Source: https://github.com/agent-evil/agentevil. GitHub Actions validated and deployed commit `cc8e1abab3b0b1579abd49ff50d8d30da666c3f7` on September 22, 2026; [release run](https://github.com/agent-evil/agentevil/actions/runs/35691384357) succeeded on attempt 2. Cloudflare Pages production deployment: `04324999-e982-472f-987b-92009ce5627e`. Both deployment secrets are configured. The custom domain, DNS verification and certificate validation are active. Live giscus comments remain optional and disconnected.

- Development: http://localhost:4321/ (English), /zh/ and /fr/.
- The installed Astro CLI starts background servers. Use `bunx astro dev status`, `bunx astro dev logs`, `bunx astro dev stop`; preview has corresponding commands.
- Production preview for tests: `bun run preview --port 4322`.
- Do not rebuild while browser tests read `dist`: Astro replaces it during builds, causing transient 404s.
- The final translated build passed GitHub CI: type checking, build, static audit, 20 browser groups, 120 accessibility/Tab groups, state tests and all 12 Lighthouse pages (>=95 in all four categories). The exact validated artifact was deployed. See docs/VERIFICATION.md for CI results and 47 live HTTP checks.

## Owner decisions

1. Agent Evil is a slightly evil but endearing Yeti, nicknamed 邪体, with a Yeti wordplay. Never restore the superseded robot mascot.
2. The site is an independent satire publication with an evidence-based AI Ideology Atlas. Moltbook is the founding incident, not the whole subject.
3. Apply the same evidential standard to enthusiasts, skeptics, vendors and ourselves. Do not force symmetrical criticism.
4. Code, identifiers, comments and repository documentation are English. Product UI and content are English, Simplified Chinese and French. The detailed Chinese PROMPT.md stays gitignored.
5. Bun only for dependencies and project scripts; retain bun.lock. Astro static output, strict TypeScript, MDX collections, vanilla CSS and TypeScript. No React or Tailwind.
6. One Reality Console, no automatic boarding modal. The latest owner request adds icon-only language and light/dark shortcuts directly in the top bar, plus GitHub linking to https://github.com/agent-evil/agentevil. Atlas is primary navigation. Narrative framing replaces political left/center/right lenses.
7. Preserve existing articles, the Yeti, four-theme design and route structure. Do not restart. Remove red dots and red sun/disc imagery: the active Yeti art is monochrome and the UI uses gold/forest/sage accents without branding punctuation.
8. The owner requests token economy: batch checks, avoid repeated AI polling and reuse existing translations. Sol is permitted for translation if delegation is explicitly needed; no sub-agents were used during completion.
9. Do not invent deployment, endorsements, independent human review, uptime, vote-fraud rates, training-text provenance or performance measurements.

## Implementation

### Routes and content

- `src/pages/index.astro`: English homepage.
- `src/pages/[...route].astro`: localized homes, listings, 18 article routes, 75 Atlas routes, About, incident archive and localized 404 pages.
- `src/pages/404.astro`: Cloudflare-compatible 404.html, with language links.
- `src/pages/[...feed].xml.ts`: three RSS feeds, six articles each.
- 111 HTML pages total, plus feeds and sitemap.
- Six articles, each with a full English, Simplified Chinese and French MDX body: eighteen files. Localized routes render the translated body and mark its language. The English-body notice remains in the UI only for a future article without a translation.
- Translation completion check, 2026-09-22: `bun run check` reported 0 errors, 0 warnings and 0 hints. The production build stayed at 111 HTML pages. Static audit passed with 3,413 internal references, 108 sitemap URLs and 21 social images. The reference count is eight lower than the earlier audit because those routes no longer render an English-original link. The 20-group browser suite passed, including body language on the Chinese and French think-for-yourself routes. All eight new translations were opened at 360px and 1440px: correct language, no English-body notice, four Evil notes, no horizontal overflow, and no WCAG A/AA axe violations. A mobile note opened and closed, the Chinese index linked into the article, the language control switched that article to French, and the Chinese trusting-agent page remained readable with JavaScript disabled. The later release CI repeated Lighthouse and all 120 keyboard/accessibility groups on the completed translations; all passed.
- 25 complete trilingual Atlas entries with search, category filtering, result count, empty state, sources and related links. No-JS visitors get the entire list.
- `Article.astro` renders the MDX component map, sources, fiction/context labels, related entries and next article.
- `Information.astro` and `lib/information.ts` contain three-language About and incident content, production disclosure and local privacy details.
- `lib/framing.ts` contains all three alternate openings for both flagships in all languages. The original body remains present.
- `content.config.ts` uses direct Zod 4 imports, typed category/kind enums and a filename-based post ID generator. The latter prevents translated articles sharing a canonical slug from overwriting each other.

### Client and console

`src/lib/client.ts` is the shared, dependency-light enhancement module:

- Validated local state under `evil:passenger:v1`; storage failure falls back to working in-memory settings.
- Native dialog with explicit forward/reverse keyboard wrapping, Escape, return focus, editable-safe Alt+E shortcut and scroll padding below the sticky console header.
- Four themes; light/dark/system mode with live system preference changes; canonical-route language links.
- `TopBar.astro`: icon-only language menu, direct persistent light/dark toggle, owner-supplied GitHub link and console entry. The native language menu also works without JavaScript and closes when keyboard focus leaves it. Mobile header has two rows; the console retains its full settings.
- Authored framing, unsupported-page feedback, five datelines/vantage points, persistent Evil muting.
- Desktop note rail aligned with preceding paragraphs; collisions push down and reserve space. ResizeObserver, viewport changes and font readiness recalculate it.
- Mobile native details start collapsed after enhancement. No-JS notes remain open in source order.
- Ten localized fake censor decodings, click count, Escape dismissal, bounded tooltip position and reduced motion.
- Optional passenger registration, role greetings, New Game+, eight achievements, unobtrusive status toasts.
- Article completion requires 15 seconds of visible-page dwell and the end in view. Atlas visits require 4 seconds and end visibility.
- Reset requires confirmation and removes only the site's storage key.
- Lazy giscus configuration, canonical article terms shared across languages, theme/language support; honest disconnected UI without IDs.

### Design and assets

- Four preserved themes: Terminal, Broadsheet, Saturday Morning and Classified.
- CSS layers: reset, base, components, theme, utilities. This corrects previously ineffective theme overrides.
- Small-screen Broadsheet and Cartoon mastheads have explicit responsive sizes. Mobile document scroll padding accounts for the two-row header; console scroll padding keeps focused controls below its sticky toolbar. Console and toast entry animations retain opaque text/backgrounds throughout.
- Unsupported registered-trademark symbol, decorative brand dots and red/orange accents removed.
- Self-hosted fonts fixed to actual package entry points.
- Current source art: `src/assets/yeti-broadcast-neutral.png`; matching optimized WebP variants under public/images. The built-in image tool removed the colored disc and orange tabletop ink while preserving the Yeti; docs/DESIGN.md records the edit prompt.
- The superseded robot and original colored-disc source images remain unused; no artwork was deleted.
- `scripts/og.ts` creates 21 localized 1200x630 typographic social images (seven each for EN/ZH/FR) with the Yeti and satire label; runs during build. Fontconfig, DejaVu Sans and Noto Sans CJK SC are required on the build host and installed by CI. Legacy image URLs are retained.
- Favicon, robots.txt and generated `/llms.txt` exist. The shared head emits complete image/locale Open Graph metadata, explicit Twitter cards, canonical/hreflang, unique page descriptions and indexing policy. Articles include published time, author disclosure URL, section and related Atlas tags. Article JSON-LD uses the actual body language. All three 404 pages have noindex and are excluded from the sitemap. Modification dates and social handles are omitted when unavailable.
- docs/DESIGN.md records the preservation audit and src/themes/README.md documents extension.

### Sources and editorial limits

- docs/SOURCES.md records primary-source checks and evidential limits.
- The seven reference groups pending in the earlier handoff were opened and reviewed. EU source URL was repaired; NSF and CAIS use canonical destinations; a primary techno-optimist manifesto was added.
- 23 external source URLs were checked: 22 returned HTTP 200; OECD returned 403 to the automated client and opened successfully in the web reader.
- The articles remain AI-assisted drafts without independent human fact-checking; the public About page states that accurately.
- Fictional satire is labeled before the body. Sources remain reachable without the optional settings.
- Catalog dates are labeled as catalog dates, not claims of completed review.

## Toolchain

Bun 1.4.2, Node 24.21.0, Astro 7.3.3, MDX 8.0.1, TypeScript ~6.0.3, Zod 4.6.5. Keep the TypeScript constraint: the installed checker did not support TypeScript 7 in the initial session. Sharp, Playwright, axe and Lighthouse are development tools. No framework runtime was added to the browser.

## Verification and reproducibility

```sh
bun install --frozen-lockfile
bun run check
bun run build
bun run audit:static
bun run preview --port 4322
bun run test:browser
bun run test:state
bun run test:a11y
bun run test:lighthouse
bun scripts/sources-check.ts
```

- Type checking: 0 errors, 0 warnings, 0 hints in the latest completed check.
- Build: 111 HTML pages. The bundler emits upstream warnings about Astro's generated `use astro:head-inject` directive in MDX modules. These were not suppressed. Rendered article content and metadata are validated.
- Static audit (2026-09-22): 111 HTML pages, 3,413 internal references, 108 sitemap URLs and 21 localized social images passed. Checks cover per-page unique descriptions, social fields and image files, indexing policy, hreflang destinations, Article body language, robots, llms links and feed counts. Conservative per-page gzip JS ceiling is 15,118 bytes, including inline scripts. The 169-file static build has a largest asset of 418,006 bytes, within Pages Free asset limits.
- Browser matrix passed all 20 check groups: 360px and 1440px, four themes, both modes, trilingual homepages, articles and console. Axe now covers homepages in all theme/mode combinations as well as articles, consoles, the expanded language menu and Atlas indexes. The dedicated suite passed 120 axe/whole-page Tab/keyboard groups across nine page types, three languages and two widths. A final six-group keyboard rerun covers shortcut focus restoration. No-JS reading, reduced motion, denied storage and existing interactions also passed. The earlier September 19 five-width header check remains historical evidence.
- Dedicated state tests passed for dwell thresholds, reader/scholar achievements, cancelled and confirmed reset, unrelated storage preservation and malformed saved state.
- Measured Lighthouse (2026-09-22, final translated build in GitHub CI): all 12 representative mobile pages passed. Performance 96–100; accessibility, best practices and SEO all 100. Covers three homepages, article index, four article routes, Atlas index/detail, About and incident. All article routes in this run served their translated bodies. CI production preview, not field data. Exact scores and commands are in docs/VERIFICATION.md; raw reports are in test-results/lighthouse/.
- Screenshots and raw JSON reports are in ignored test-results/. The current Lighthouse script writes directly to test-results/lighthouse/.
- This round fixed dialog Tab boundaries, focus hidden behind sticky toolbars, a too-small mobile scroll offset and transient contrast during entry animations. Wrapped-link visibility checks use individual line fragments; focus assertions wait for native dialog close events. No axe rules were disabled. Earlier Broadsheet overflow/media-emulation fixes remain in place. Builds and browser tests use a stable artifact.

## Release configuration

- Public repository: https://github.com/agent-evil/agentevil. Local branch `main` tracks `origin/main`. Cloudflare Pages Direct Upload project: `agentevil`, production branch `main`.
- GitHub repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are configured. The token needs Account → Cloudflare Pages → Edit. Never expose credentials in chat, logs or Git.
- `agentevil.com` is attached to the Pages project. The owner added the proxied apex CNAME to `agentevil.pages.dev`; domain, DNS and TLS validation are active.
- GitHub Actions gates publishing on static, browser/state, keyboard/axe and Lighthouse checks and uploads the same validated artifact. [Run 35691384357](https://github.com/agent-evil/agentevil/actions/runs/35691384357) succeeded on attempt 2. The first attempt validated successfully but lacked the API token captured at queue time; rerunning only the failed deployment picked up the newly configured secret.
- The initial setup run exposed a foreground preview process. CI now explicitly uses `--background` and always stops the preview. That superseded run was cancelled; the corrected workflow completed.
- Wrangler 4.135 defaults new project creation toward Workers. This project was explicitly created as Pages using `pages project create agentevil --production-branch main --force`. Future `pages deploy` commands use the existing Pages project normally.
- Live verification passed 47 HTTPS requests, including all 18 translated article routes, three languages of navigation/information pages, feeds, robots, llms, sitemap, social images and a real 404. Custom security headers were confirmed. Public resolvers returned the correct Cloudflare addresses; the local resolver retained an earlier negative answer, so the live smoke check used those verified addresses with normal TLS hostname/certificate validation. A follow-up request using Cloudflare DNS-over-HTTPS also returned 200 without a pinned address.
- Optional giscus configuration remains disconnected: see SETUP-GISCUS.md and .env.example. No comment-login or posting test is claimed.
- No local project Chrome/Chromium session remains. The local preview server was stopped; CI also stopped its preview.
- The owner's Chinese brief is at `../PROMPT.md`, outside this repository. `docs/PROJECT-BRIEF.md` preserves the essential requirements for clean clones. A root-level `PROMPT.md` is also gitignored if used later.

## Remaining handoff discipline

Update this file and docs/VERIFICATION.md after final verification or meaningful changes. Preserve working source and local preferences. Do not call the site deployed until an actual authenticated deployment succeeds.

## Release translation audit

All six slugs have exactly one EN, ZH and FR body. Paragraph/heading counts, four Evil notes per article, publication dates, Atlas references and sources match across each translation set; the dialogue article has 24 speeches in every language. No missing section was found in the source review. Static validation now rejects missing or duplicate language bodies instead of accepting a fallback. Latest release checks: Astro check 0 errors/warnings/hints; build 111 HTML pages; audit 3,413 internal references, 108 sitemap URLs, 21 localized social images and 15,118 gzip bytes maximum page JavaScript. Full remote release gates passed and the validated artifact is deployed. Domain and TLS validation are active.
