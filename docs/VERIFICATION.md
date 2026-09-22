# Verification record

Date: 2026-09-22. Final translated build validated in GitHub Actions and deployed to Cloudflare Pages. Automated checks do not imply independent human fact-checking.

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

Build before browser testing and keep `dist` stable until tests finish. Run Lighthouse separately from other local browser suites. Browser scripts default to the production preview above and accept `TEST_URL`. Full reports and screenshots are in ignored `test-results/`. CI runs the same gates before publishing the validated artifact and uploads reports even on failure; the [release workflow](https://github.com/agent-evil/agentevil/actions/runs/35691384357) passed and deployed the validated artifact.

## Build, discovery and SEO

- Astro check: 0 errors, 0 warnings, 0 hints.
- Production build: 111 HTML pages, three RSS feeds, 108 indexable sitemap URLs, robots.txt, llms.txt and localized social images. The known upstream MDX `use astro:head-inject` warnings remain visible during build.
- Static audit: 3,413 internal references including anchors/assets; content references; six items in each RSS feed; unique descriptions for indexable pages; exact canonical/hreflang destinations; robots and llms links; exclusion of error pages from the sitemap.
- Every page has explicit Open Graph and Twitter title, description, image and image alternative text. OG includes PNG MIME type, HTTPS URL, dimensions, site name and alternate locales. All 21 active images are checked as actual 1200×630 PNGs, with one default plus six article covers in each language. Seven legacy URLs remain available.
- Article metadata includes publication time, author disclosure URL, section and related Atlas tags. All 18 article routes have Article JSON-LD whose language matches the actual body. Every article now has a full body in each language. Static validation also requires exactly one source body per slug and language; no English fallback is accepted for the launch content. No modification dates, social account handles, endorsements or review claims were fabricated.
- All three error pages have `noindex, follow`. llms.txt is generated from content collections and explains fictional material, source limitations, AI-assisted production and translation coverage. It links to static HTML without implying that Markdown exports exist.
- Conservative page JavaScript ceiling: 15,118 gzip bytes (14,814 shared plus 304 inline), below 51,200 bytes. Giscus remains separate and unloaded until requested/configured.
- Cloudflare Pages Free asset checks: 169 static files; largest file 418,006 bytes. The audit enforces 20,000 files and 25 MiB per asset and rejects a generated Worker entry point. This checks build suitability, not live hosting behavior.

## Browser, keyboard and accessibility

The 20-group browser matrix passed at 360px and 1440px, across four themes and both light/dark modes. It checks articles, consoles and all three homepages. Axe WCAG A/AA checks now include the trilingual homepages in every theme/mode, in addition to articles, consoles, the expanded language menu and three Atlas indexes. No failures were reported.

The dedicated accessibility suite passed 120 groups: nine page types × three languages × two widths for both axe and forward/reverse page Tab traversal (108 groups), six console axe scans and six complete keyboard workflows. Rules include WCAG 2 A/AA, 2.1 AA and the available 2.2 AA rules. Page types include home, article index, flagship article, translated satire article, Atlas index/detail, About, incident file and error page.

Keyboard workflows cover the first-Tab skip link and actual focus transfer to main content, language-menu Enter/Tab/Escape, closing the menu when focus leaves it, visible focus rings, complete forward/reverse console traversal, Escape focus restoration, mobile note disclosure and search/clear focus. A final six-group targeted keyboard rerun also verifies Alt+E from a language choice returns focus to the visible language control. Its report is `test-results/keyboard-report.json`; it supplements the full `a11y-report.json`.

The browser suite also covers no automatic boarding, persistent settings, system mode changes, optional character registration, New Game+, authored framing, unsupported-framing feedback, all observation locations, notes, mosaics, reduced motion, no-JS reading/navigation/search listings and blocked storage. The dedicated state suite passed reading/Atlas dwell thresholds, achievements, cancelled and confirmed reset, preservation of unrelated storage and malformed state rejection.

This round found and fixed actual keyboard defects: native dialog traversal could reach the browser boundary; focused controls could be covered by the console toolbar; and the mobile document's old scroll padding was shorter than its two-row header. Explicit dialog wrapping and appropriate scroll padding correct these. Language-menu focus loss now closes the menu, and shortcut focus restoration targets its visible summary. Console/toast entry animations keep an opaque background and text throughout, avoiding transient low contrast. The French mute control has a stable minimum width.

Test-harness corrections distinguish wrapped inline link fragments from empty space within a combined bounding box, and wait for native dialog close/focus events instead of racing them. No axe rule was disabled. Agent-browser spot checks visually confirmed a visible mobile source-link focus ring below the header, console endpoint wrapping, French mobile layout and localized social images.

These are automated and keyboard checks, not a claim of complete WCAG conformance or a screen-reader audit. Safari, Firefox and physical mobile devices have not been tested.

## Lighthouse

All 12 mobile runs passed the >=95 gate in each category. These are sequential lab runs in GitHub Actions against the final translated production build, with no concurrent Agent Evil browser suite. They are not field measurements or a guarantee for every device. Raw CI JSON and `summary.json` are in `test-results/ci-release/lighthouse/` (the workflow artifact stores them under `lighthouse/`).

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

The release CI repeated Lighthouse and the 120-group keyboard/accessibility suite after translation completion. Both passed. The scores above describe the translated release artifact. Downloaded CI evidence is stored locally in `test-results/ci-release/`; the Actions run retains the uploaded reports for seven days.

## Sources and untested integrations

Source availability results below are retained from September 19; external sources were not rechecked for the SEO and keyboard changes.

Twenty-three distinct external source URLs were requested. Twenty-two returned HTTP 200. OECD denied the automated client with HTTP 403 but was accessible through the web reader. This checks availability, not correctness; see [SOURCES.md](SOURCES.md) for supporting scope and editorial limitations.

No configured giscus repository exists. Its disconnected state was checked and no third-party script loads by default. Actual authentication, posting and live iframe synchronization require the owner to configure repository/category IDs. Cloudflare headers, routing, DNS/TLS and GitHub Actions deployment have now been verified as recorded below. No production field-performance result or additional redirect configuration is claimed. Chromium was tested; Safari, Firefox and physical mobile devices were not.

Raw screenshots and JSON reports are in ignored `test-results/`. Historical September 19 Lighthouse JSON files remain as `agent-evil-lighthouse-{en,zh,fr}.json`; local reports are under `test-results/lighthouse/`, and final release CI reports are under `test-results/ci-release/lighthouse/`. The source records and this report are the durable summary; `/tmp` logs are disposable.

## Production release

- Source commit: `cc8e1abab3b0b1579abd49ff50d8d30da666c3f7`.
- [GitHub Actions run 35691384357](https://github.com/agent-evil/agentevil/actions/runs/35691384357), attempt 2: success. Validation passed in attempt 1; only deployment was rerun after the owner added the repository API token. The earlier workflow-startup issue was fixed by explicitly backgrounding Astro preview and stopping it with an always-run cleanup step.
- Cloudflare Pages production deployment: `04324999-e982-472f-987b-92009ce5627e`, https://04324999.agentevil.pages.dev. The deployment references the source commit above and reports success.
- https://agentevil.com and https://agentevil.pages.dev returned HTTPS 200. Cloudflare reports active custom-domain verification and TLS validation. The owner configured the apex CNAME; public DNS resolvers 1.1.1.1 and 8.8.8.8 returned the Cloudflare addresses.
- The live smoke check passed 47 requests, including all 18 translated articles, localized homes/indexes/Atlas/About/incident pages, RSS feeds, robots.txt, llms.txt, both sitemap files, three 1200×630 localized social images and a nonexistent route returning a real 404. Article body-language metadata, canonicals, social metadata and four notes per article were checked. Security headers include nosniff, frame denial, referrer policy and camera/microphone/geolocation restrictions.
- The local DNS resolver retained a negative answer from before setup, so custom-domain HTTP checks used public/authoritative DNS addresses through curl's `--resolve`, with normal TLS hostname and certificate verification. A subsequent request using Cloudflare DNS-over-HTTPS also returned 200 without a pinned IP. These checks retain HTTPS validation. Raw results: `test-results/live-release.json`.
- The local preview server is stopped. Agent Evil has no remaining Chrome/Chromium processes or agent-browser sessions; this release used the remote CI browser suites and HTTP checks locally.
