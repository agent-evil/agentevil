# Verification record

Date: 2026-09-22. Local static build, Chrome/Chromium keyboard checks and automated accessibility checks. No production deployment or independent human fact-check is implied.

## Environment and reproduction

Bun 1.4.2, Node 24.21.0, Astro 7.3.3 and Google Chrome 152.0.7977.64. Production preview: `http://localhost:4322`. Existing browser suites use Playwright and axe; interactive keyboard/visual inspection used a named agent-browser session (Chromium 148). Fontconfig, DejaVu Sans and Noto Sans CJK SC are build prerequisites for localized social images; GitHub Actions installs them.

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
```

Build before browser testing and keep `dist` stable until tests finish. Run Lighthouse separately from other local browser suites. Browser scripts default to the production preview above and accept `TEST_URL`. Full reports and screenshots are in ignored `test-results/`. CI runs the same gates before publishing the validated artifact and uploads reports even on failure; the remote workflow has not been executed.

## Build, discovery and SEO

- Astro check: 0 errors, 0 warnings, 0 hints.
- Production build: 111 HTML pages, three RSS feeds, 108 indexable sitemap URLs, robots.txt, llms.txt and localized social images. The known upstream MDX `use astro:head-inject` warnings remain visible during build.
- Static audit: 3,421 internal references including anchors/assets; content references; six items in each RSS feed; unique descriptions for indexable pages; exact canonical/hreflang destinations; robots and llms links; exclusion of error pages from the sitemap.
- Every page has explicit Open Graph and Twitter title, description, image and image alternative text. OG includes PNG MIME type, HTTPS URL, dimensions, site name and alternate locales. All 21 active images are checked as actual 1200×630 PNGs, with one default plus six article covers in each language. Seven legacy URLs remain available.
- Article metadata includes publication time, author disclosure URL, section and related Atlas tags. All 18 article routes have Article JSON-LD whose language matches the actual body. During the SEO run recorded above, the four articles without complete translations kept English language metadata and a visible fallback notice. Those four now have full Chinese and French bodies; see the translation check below. No modification dates, social account handles, endorsements or review claims were fabricated.
- All three error pages have `noindex, follow`. llms.txt is generated from content collections and explains fictional material, source limitations, AI-assisted production and translation coverage. It links to static HTML without implying that Markdown exports exist.
- Conservative page JavaScript ceiling: 15,244 gzip bytes (14,940 shared plus 304 inline), below 51,200 bytes. Giscus remains separate and unloaded until requested/configured.
- Cloudflare Pages Free asset checks: 169 static files; largest file 418,006 bytes. The audit enforces 20,000 files and 25 MiB per asset and rejects a generated Worker entry point. This checks build suitability, not live hosting behavior.

## Browser, keyboard and accessibility

The 20-group browser matrix passed at 360px and 1440px, across four themes and both light/dark modes. It checks articles, consoles and all three homepages. Axe WCAG A/AA checks now include the trilingual homepages in every theme/mode, in addition to articles, consoles, the expanded language menu and three Atlas indexes. No failures were reported.

The dedicated accessibility suite passed 120 groups: nine page types × three languages × two widths for both axe and forward/reverse page Tab traversal (108 groups), six console axe scans and six complete keyboard workflows. Rules include WCAG 2 A/AA, 2.1 AA and the available 2.2 AA rules. Page types include home, article index, translated article, English-body article, Atlas index/detail, About, incident file and error page.

Keyboard workflows cover the first-Tab skip link and actual focus transfer to main content, language-menu Enter/Tab/Escape, closing the menu when focus leaves it, visible focus rings, complete forward/reverse console traversal, Escape focus restoration, mobile note disclosure and search/clear focus. A final six-group targeted keyboard rerun also verifies Alt+E from a language choice returns focus to the visible language control. Its report is `test-results/keyboard-report.json`; it supplements the full `a11y-report.json`.

The browser suite also covers no automatic boarding, persistent settings, system mode changes, optional character registration, New Game+, authored framing, unsupported-framing feedback, all observation locations, notes, mosaics, reduced motion, no-JS reading/navigation/search listings and blocked storage. The dedicated state suite passed reading/Atlas dwell thresholds, achievements, cancelled and confirmed reset, preservation of unrelated storage and malformed state rejection.

This round found and fixed actual keyboard defects: native dialog traversal could reach the browser boundary; focused controls could be covered by the console toolbar; and the mobile document's old scroll padding was shorter than its two-row header. Explicit dialog wrapping and appropriate scroll padding correct these. Language-menu focus loss now closes the menu, and shortcut focus restoration targets its visible summary. Console/toast entry animations keep an opaque background and text throughout, avoiding transient low contrast. The French mute control has a stable minimum width.

Test-harness corrections distinguish wrapped inline link fragments from empty space within a combined bounding box, and wait for native dialog close/focus events instead of racing them. No axe rule was disabled. Agent-browser spot checks visually confirmed a visible mobile source-link focus ring below the header, console endpoint wrapping, French mobile layout and localized social images.

These are automated and keyboard checks, not a claim of complete WCAG conformance or a screen-reader audit. Safari, Firefox and physical mobile devices have not been tested.

## Lighthouse

All 12 mobile runs passed the >=95 gate in each category. These are sequential, local lab runs against the final production build, with no concurrent Agent Evil browser suite. They are not field measurements or a guarantee for every device. Raw JSON and `summary.json` are in `test-results/lighthouse/`.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 96 | 100 | 100 | 100 |
| `/zh/` | 96 | 100 | 100 | 100 |
| `/fr/` | 97 | 100 | 100 | 100 |
| `/posts/` | 100 | 100 | 100 | 100 |
| `/posts/manifesto/` | 100 | 100 | 100 | 100 |
| `/zh/posts/manifesto/` | 100 | 100 | 100 | 100 |
| `/fr/posts/maintenance/` | 100 | 100 | 100 | 100 |
| `/fr/posts/think-for-yourself/` | 100 | 100 | 100 | 100 |
| `/zh/atlas/` | 99 | 100 | 100 | 100 |
| `/fr/atlas/ai-alignment/` | 100 | 100 | 100 | 100 |
| `/about/` | 99 | 100 | 100 | 100 |
| `/incident/` | 100 | 100 | 100 | 100 |

## Full article translations

Checked after the four remaining articles received complete Simplified Chinese and French bodies. `bun run check`: 0 errors, 0 warnings, 0 hints. Production build: 111 HTML pages. Static audit: 3,413 internal references, 108 sitemap URLs, 21 localized social images. The eight English-original links inside the old fallback notices are gone, which accounts for the lower reference count.

The existing 20-group browser suite passed, including the Chinese and French think-for-yourself body language. A separate Chrome pass opened all eight new translations at 360px and 1440px. Each page used the translated body language, hid the English-body notice, showed four Evil notes, and had no horizontal overflow. Axe WCAG A/AA reported no violations on those sixteen views. On a 390px viewport the first Chinese note started collapsed, opened to its translated text, and closed again. The Chinese article index opened the think-for-yourself article, and the language control switched that same article to French. With JavaScript disabled, the Chinese trusting-agent page still showed the translated dialogue, 24 speeches and four open notes.

Lighthouse and the 120-group keyboard suite were not repeated for this content change. The scores above describe the preceding build, when `/fr/posts/think-for-yourself/` still displayed an English body.

## Sources and untested integrations

Source availability results below are retained from September 19; external sources were not rechecked for the SEO and keyboard changes.

Twenty-three distinct external source URLs were requested. Twenty-two returned HTTP 200. OECD denied the automated client with HTTP 403 but was accessible through the web reader. This checks availability, not correctness; see [SOURCES.md](SOURCES.md) for supporting scope and editorial limitations.

No configured giscus repository exists. Its disconnected state was checked and no third-party script loads by default. Actual authentication, posting and live iframe synchronization require the owner to configure repository/category IDs. Cloudflare headers, redirects, GitHub Actions deployment, DNS and production performance remain untested because no remote deployment or account connection exists. Chromium was tested; Safari, Firefox and physical mobile devices were not.

Raw screenshots and JSON reports are in ignored `test-results/`. Historical September 19 Lighthouse JSON files remain as `agent-evil-lighthouse-{en,zh,fr}.json`; current reports are under `test-results/lighthouse/`. The source records and this report are the durable summary; `/tmp` logs are disposable.
