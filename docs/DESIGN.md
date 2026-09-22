# Art direction

Reading this as an independent editorial publication for technically literate readers, with a pirate-radio voice and a disciplined magazine grid. Design variance 6, motion 3, density 3. The empty repository is a greenfield build.

## Shared skeleton

A narrow status strap, a deliberately oversized masthead, a two-column lead story with a commissioned fictional print illustration, then unequal editorial columns. Body measure 68ch. Fine rules do real grouping work. The mascot is a shaggy ivory yeti pirate-radio presenter with unreasonable self-regard. Its tiny inline counterpart uses a compact CSS yeti face, not a second character. No fictitious live numbers, scroll hijacks or automatic boarding. The console has conventional functional labels alongside equipment names.

## Terminal

Charcoal #171817 / panel #20211f / ivory #e8e5dc / muted #aaa9a0 / gold #d7bc68 / rule #41443e. Barlow Condensed display, Public Sans body, IBM Plex Mono utility. The massive compressed wordmark is the signature, without decorative punctuation. Light mode uses a grey-white field and dark gold #765a14. Removed accessories: no scrolling news ticker, red dot or sun/disc imagery.

## Broadsheet

Paper #f4f3ef / ink #252923 / forest #365a44 / rule #d0d1c7 / secondary #62685f. Newsreader display and body, IBM Plex Mono metadata. Signature: double-rule masthead and literary serif voice. Body initials may be enlarged on wide screens without disrupting text. Removed accessory: no fake paper tears.

## Saturday Morning

Chalk #f7f5ed / ink #252326 / dark gold #775414 / yellow #f6cb52 / secondary #625953. Fredoka display, Public Sans body, IBM Plex Mono utility. Signature: solid outline and offset-shadow speech box; typography remains on the same editorial grid. Removed accessory: no starbursts.

## Classified

File #e9ede6 / ink #253029 / stamp #4b6252 / rule #bcc5b9 / muted #526050. Dark-mode accent is sage #acbfae. IBM Plex Mono display and utility, Public Sans body. Signature: one restrained classification stamp, with censor mosaics rendered as solid redactions. Removed accessory: no paperclip ornaments.

## Critique before implementation

A terminal interface is a common AI default. Avoid its predictable neon green and all-monospace body. Make the masthead, linocut image, candid labeling and dialogue carry the identity. All four themes retain navigation, content order and note placement. The design must remain legible without the image, fonts, local storage or JavaScript. No made-up metrics to fill whitespace.

## Image provenance

`src/assets/yeti-broadcast.png` was generated with the built-in image generation tool. It is fictional editorial illustration, not evidence. Prompt: landscape linocut/risograph of a slightly evil yet endearing ivory yeti with pointed fur tufts, expressive dark eyebrows, small fangs and a tiny black bowtie, paper in paw, ribbed microphone, crumpled pages; charcoal, ivory and vermilion; orange disc; no text, no photorealism, no glow. Final web assets are compressed copies; original is retained.

The original image above is retained only as source history and is no longer referenced by the UI. The active source is `src/assets/yeti-broadcast-neutral.png`, edited with the built-in image generation tool on 2026-09-19. Its optimized variants are `public/images/yeti-broadcast-neutral.webp` and `public/images/yeti-broadcast-neutral-small.webp`; social images use this version too.

Edit prompt: "Use case: precise-object-edit. Edit this website editorial illustration. Remove the large orange-red circular sun/disc completely and fill that area with the same textured charcoal background as the corners. No circle, sun, halo, rays, red dots, flags or political symbols. Remove the orange-red ink from the tabletop too, replacing it with restrained ivory and charcoal print texture. Preserve the exact ivory Yeti character, face, shaggy silhouette, expressive eyebrows, small fangs, tiny black bowtie, paper in paw, ribbed microphone, crumpled papers, landscape framing and woodcut/risograph technique. Keep composition unchanged; only remove the colored disc and red/orange ink. Monochrome charcoal and ivory palette. No text. Intended final project filename yeti-broadcast-neutral.png."

The mascot is a yeti, a pun on the Chinese abbreviation for evil agent. The original robot direction was superseded before implementation. Code, comments and repository documentation are English; product content is trilingual.

## Completion audit

Implementation continued in preservation mode on 2026-09-19: retain the four palettes, existing artwork, editorial hierarchy, routes and writing. The frontend design skill informs layout and accessibility checks; the project brief takes priority over generic landing-page rules, including the oversized publication masthead, long-form articles, multiple selectable themes, broadcast datelines and authored punctuation.

The shared layer order is now reset, base, components, theme, utilities so theme signatures can actually override component defaults. Broadsheet and Cartoon receive explicit small-screen masthead sizing. The unsupported registered-trademark symbol and decorative brand punctuation were removed. UI text now distinguishes cataloguing from independent review and narrative roles from AI-assisted production.

The owner's latest direction supersedes the original single-entry settings requirement: the top bar contains icon-only language, light/dark, GitHub and Reality Console controls. Language uses native details and route-preserving links, including without JavaScript. Lighting persists and stays synchronized with the console. GitHub defaults to the owner-provided `https://github.com/agent-evil/agentevil`, with an optional public environment override. Mobile navigation uses two rows so the controls remain usable at 360px. Gold and sage replace red/orange accents; there is no red dot, red sun or red branding punctuation.

Per-article social images are generated from the existing Yeti illustration and type using Sharp, not fabricated news screenshots. They carry a satire/commentary label. Desktop notes retain source order and are visually positioned beside their preceding paragraph, with collision spacing. Mobile uses native disclosure controls and no empty note rail.
