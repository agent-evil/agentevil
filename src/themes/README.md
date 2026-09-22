# Theme extension

The four themes use the same semantic HTML. Each CSS file defines `--bg`, `--panel`, `--text`, `--muted`, `--accent`, `--line`, `--display`, `--body`, `--headline-weight` and `--radius` under a `data-theme` selector. Set a dark or light override with `data-mode` and set `color-scheme` accordingly. The utility font is inherited from Terminal.

CSS layers are reset, base, components, theme, utilities. Theme signatures intentionally override shared component rules; accessibility and hidden-state utilities remain last. Theme rules must include mobile sizes, and must not change document order, navigation or the article content. Prefer semantic variables over additional selectors.

To add a theme, import its stylesheet in `global.css`, register its name and swatch in `registry.ts`, and update the validated theme allowlists in `client.ts` and the early initializer in `Base.astro`. Update the wardrobe achievement and verification matrix to match the new total. Add only required self-hosted fonts to Base. Test both modes at 360px and desktop, including the console, notes, buttons and focus indicators.
