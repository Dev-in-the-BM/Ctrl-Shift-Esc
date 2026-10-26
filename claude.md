# Project guidance

## Purpose

In Plaintext is a personal, content-first publication. Its identity should fit the writer and the writing—not any one topic. The editorial scope includes technology, software and social questions, philosophy, and the frum Jewish community. Preserve a calm, thoughtful, elegant reading experience without making it generic.

## Project conventions

- The site is built with Astro and Tailwind. Preserve the existing framework, content pipeline, routes, deployment base, metadata, RSS/canonical behavior, and post ordering unless explicitly asked otherwise.
- Keep unpublished drafts and underscore-prefixed unlisted posts private. Do not invent author facts, dates, images, or editorial content.
- Keep accessibility, keyboard navigation, reduced motion, readable contrast, responsive behavior, and long-form comfort central to UI changes.
- The original repository may contain user edits. Inspect status and diffs before modifying or staging; do not reset, discard, or accidentally commit unrelated changes.

## Redesign workflow

- The original blog is the baseline and must remain unchanged unless the user explicitly selects a design and asks to apply it.
- Redesign directions live in independent branches/worktrees under `worktrees/`. Current relevant locations are `worktrees/editorial` and `worktrees/editorial-experiment`.
- Work on only the active direction. Do not merge branches or start a later direction before the user reviews the current checkpoint.
- The palette selector in the experiment is temporary: keep it isolated, ensure it controls the full set of relevant visual tokens, and remove it before production if requested.
- For heading/Markdown visual references, inspect real rendered pages in light and dark modes. The user supplied a Flarum reference: https://discuss.flarum.org/d/36949-bb-code-cheat-sheet-for-flarum/4. Avoid treating modern Discourse themes as canonical when the user asks for traditional Markdown rendering.
- Commit only within the intended worktree/branch. Include requested review evidence when the user asks to commit everything; never stage unrelated files.

## Typography note

The current editorial experiment bundles Newsreader for selected literary serif headings/decks, Source Sans 3 for UI and continuous article prose, Patrick Hand for selected informal standfirst/excerpt treatments, and IBM Plex Mono as a separate monospaced face. These are locally bundled font files and normal CSS font-face declarations; there are no custom-drawn or modified font glyphs. Newsreader itself does not have a monospaced version. IBM Plex Mono is the current code-like companion; assess any alternative in rendered long-form content before adopting it.
