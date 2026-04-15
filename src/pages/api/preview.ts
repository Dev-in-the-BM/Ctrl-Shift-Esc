import type { APIRoute } from 'astro';

// Opt-out of static generation for this API route - it needs to run server-side
export const prerender = false;

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkLinkCard from 'remark-link-card';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
// @ts-ignore - types for rehype-sanitize are not fully compatible
import rehypeSanitize from 'rehype-sanitize';
import { remarkSmartImages, remarkCustomDirectives } from '../../../remark-custom-plugins.mjs';
import { responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from '../../utils/frontmatter';

// Custom sanitize schema to allow our custom elements and attributes
const sanitizeSchema = {
  tagNames: [
    'details', 'summary', 'iframe', 'div', 'span', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'strong', 'em', 'del', 'ins',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'figure', 'figcaption', 'input'
  ],
  attributes: {
    '*': ['class', 'style', 'data-fancybox', 'data-type', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes', 'alt', 'title', 'id', 'name', 'target', 'rel', 'href'],
    details: ['class', 'open'],
    summary: ['class'],
    a: ['class', 'href', 'data-fancybox', 'data-type', 'target', 'rel'],
    img: ['class', 'src', 'alt', 'title', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes', 'style'],
    input: ['type', 'checked', 'disabled', 'class'],
  },
  strip: [],
  clobber: [],
  clobberPrefix: '',
  ancestors: {
    li: ['ol', 'ul'],
  },
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],
    src: ['http', 'https'],
  },
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { markdown, frontmatter } = await request.json();

    if (!markdown) {
      return new Response(JSON.stringify({ error: 'No markdown content provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process the markdown with all custom plugins
    const result = await unified()
      .use(remarkParse)
      .use(remarkLinkCard)
      .use(remarkDirective)
      .use(remarkSmartImages)
      .use(remarkBreaks)
      .use(remarkCustomDirectives)
      .use(remarkRehype, { allowDangerousHtml: true })
      // @ts-ignore-next-line - rehype-sanitize types are incompatible
      .use(rehypeSanitize as any, sanitizeSchema)
      .use(responsiveTablesRehypePlugin)
      .use(lazyImagesRehypePlugin)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown);

    const html = result.toString();

    return new Response(JSON.stringify({ 
      html,
      frontmatter,
      processedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Preview API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process markdown',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    error: 'This endpoint only accepts POST requests',
    usage: 'POST with { markdown: string, frontmatter: object }'
  }), {
    status: 405,
    headers: { 
      'Content-Type': 'application/json',
      'Allow': 'POST'
    }
  });
};
