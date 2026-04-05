# AstroAuthor Template

AstroAuthor is a blog-focused template built using [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), forked from the [AstroWind](https://astrowind.vercel.app/) template. It is designed to provide a rich authoring experience out of the box.

## Overview

This template expands upon the base AstroWind template with several new features and enhancements focused on improving the content authoring experience and visual presentation. Key improvements include:

*   **Enhanced Markdown Authoring:** Intuitive Markdown syntax for common formatting needs.
*   **Dynamic Image Controls:** Control image dimensions and alignment directly from Markdown.
*   **Interactive Content Elements:** Collapsible sections and spoiler tags for engaging content.
*   **Rich Link Previews:** URLs automatically transformed into visually appealing link cards.
*   **Improved Content Navigation:** Table of Contents (TOC) for longer articles.

## Key Features

### 1. Enhanced Markdown Authoring Experience

*   **Sized and Aligned Inline Images:**
    *   Syntax: `![Alt text](URL#inline-30)`
    *   Benefit: Control inline image presentation without raw HTML.
*   **Collapsible Content Blocks (`<details>`):**
    *   Syntax:
        ```markdown
        :::details[Summary Title]
        Hidden content goes here.
        :::
        ```
    *   Benefit: Enhances content organization with animated transitions.
*   **Spoiler Tags:**
    *   Syntax: `||spoiler text||` or
        ```markdown
        :::spoiler
        Spoiler block
        :::
        ```
    *   Benefit: Hides sensitive content until hovered over.
*   **Automatic Rich Link Previews (Link Cards):**
    *   Syntax: `https://github.com/lightningbolt047/Android-Toolbox` (on its own line)
    *   Benefit: Improves visual presentation of external links, especially optimized for GitHub.
*   **Image Grids:**
    *   Syntax:
        ```markdown
        :::grid[Optional Grid Title]
        ![Image 1](...)
        ![Image 2](...)
        :::
        ```
    *   Benefit: Structured display of multiple images with Fancybox gallery.
*   **Table of Contents (TOC):**
    *   Dynamic left-side navigation for blog posts.
*   **Inline Code Styling:**
    *   Enhanced visual presentation for inline code snippets.

## 2. Technical Details

These features are implemented using a custom Astro Markdown processing pipeline with:

*   **Remark Plugins:** `remark-directive`, `remark-link-card`, `remark-spoilers`, and custom plugins (`remarkSmartImages`, `remarkCustomDirectives`).
*   **Tailwind CSS:** Styling for all new elements, with dynamic utility classes.
*   **Custom CSS & Components:** Specific styling for inline code blocks and TOC.

Refer to `changes.md` for a comprehensive list of modifications and new functionalities.

## License

This project is licensed under the GPL3 License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributions

Feel free to fork this repository and submit pull requests. All contributions are welcome!
