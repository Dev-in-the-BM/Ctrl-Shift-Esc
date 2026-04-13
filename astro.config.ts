import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';
import remarkDirective from 'remark-directive';
import remarkLinkCard from 'remark-link-card';
// import remarkSpoilers from 'remark-spoilers';

import remarkBreaks from 'remark-breaks'; // Import remark-breaks
import { remarkSmartImages, remarkCustomDirectives } from './remark-custom-plugins.mjs';

import cloudflare from "@astrojs/cloudflare";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

import fs from 'fs';
import fg from 'fast-glob';
const { globSync } = fg;

// Find slugs of unlisted dotfiles to exclude them from the sitemap
const unlistedSlugs = globSync('src/content/post/.*.md').map(file => {
  const content = fs.readFileSync(file, 'utf8');
  const slugMatch = content.match(/slug:\s*['"]?([^'"\n]+)['"]?/);
  if (slugMatch) return slugMatch[1];
  const filename = path.basename(file, path.extname(file)).replace(/^\./, '');
  return filename;
});

export default defineConfig({
  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => {
        // page is a URL string like 'https://example.com/blog/my-post'
        const url = new URL(page);
        const pathSlug = url.pathname.split('/').filter(Boolean).pop();
        if (!pathSlug) return true;
        return !unlistedSlugs.includes(pathSlug);
      }
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [
      remarkLinkCard,
      remarkDirective,
      remarkSmartImages,
      remarkBreaks, // Add remarkBreaks here
      remarkCustomDirectives,
      // remarkSpoilers, // Pass the plugin function directly - Temporarily disabled due to "Cannot read properties of undefined (reading 'prototype')" error
    ],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },

  adapter: cloudflare()
});