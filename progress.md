# Redesign progress

## Current status

- The original project is preserved on its original branch. Design work is isolated in Git worktrees under `worktrees/`.
- Direction 1, **The Opinionated Reading Room**, is available in `worktrees/editorial` on `redesign/editorial`.
- The separate feedback experiment is in `worktrees/editorial-experiment` on `redesign/editorial-experiment`.
- The experiment includes a temporary six-palette selector, readable Source Sans 3 article body text, and code-block-inspired headings. Exact palette shades are intentionally provisional.
- The latest heading revision follows rendered Markdown blocks: neutral filled surface, compact fit-to-text shape, IBM Plex Mono, and no border or quote-like leading rule. The supplied Flarum reference was checked in light and dark modes; modern Discourse themes were excluded. Review the result in both themes, especially dark mode.
- Article-list excerpts and related-reading descriptions now use the same serif face as article descriptions/decks; continuous article prose remains Source Sans 3.
- Do not start Direction 2 until the user reviews and approves the current direction. Do not merge experiment changes into the primary design or original project.

## Recent checkpoints

- Editorial primary: `worktrees/editorial`, branch `redesign/editorial`, commit `1bc48df`.
- Experiment includes readable body type, six complete theme palettes, and full palette-variable coverage. Palette shades remain open for later review.
- Latest experiment checkpoint: `20390c7` (`Refine plaintext heading blocks and excerpts`), including the revised heading blocks and serif list excerpts. Review evidence is in `worktrees/editorial-experiment/review-evidence/rendered-markdown-code-blocks/`.
- Earlier heading treatment was committed as `9b2f7c0`; its heading appearance was superseded by `20390c7`.
- The body font regression was traced to `4a4c9e6` (“Add plaintext block heading treatment”), which changed article prose to Newsreader. Continuous prose has now been restored to Source Sans 3 at 21px/1.7 desktop and 20px/1.7 mobile, with slight tracking; the experiment build passed after that correction.

## Verification notes

- Previous builds passed; Astro diagnostics remain in `astro.config.ts` and `src/pages/test-glob.astro`, and `@astrojs/svelte` is missing. Recheck before reporting current status.
- The build passed before commit `20390c7`; existing Cloudflare/Vite and unresolved related-post warnings remain. No successful browser-navigation evidence is available for previously reported Playwright interaction checks, so treat those checks as unverified. Screenshots alone do not verify interactions.
- Keep screenshots and review artifacts with the isolated experiment. Avoid staging unrelated changes in the original worktree.
