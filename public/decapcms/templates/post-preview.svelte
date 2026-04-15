<script>
  import { onMount } from 'svelte';
  
  export let entry = {};
  export let currentFormat = 'markdown';
  export let getBackend = () => null;
  
  let html = '';
  let error = null;
  let loading = true;
  
  $: body = entry.raw?.body || entry.data?.body || '';
  $: frontmatter = entry.data || {};
  
  // Get the site URL for API calls
  function getSiteUrl() {
    // In production, this should be your actual site URL
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }
  
  async function processMarkdown() {
    if (!body) {
      html = '<p class="text-gray-500">No content to preview.</p>';
      loading = false;
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const siteUrl = getSiteUrl();
      const response = await fetch(`${siteUrl}/api/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          markdown: body,
          frontmatter: frontmatter
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to process markdown');
      }
      
      const data = await response.json();
      html = data.html;
    } catch (err) {
      console.error('Preview error:', err);
      error = err.message || 'Failed to render preview';
      html = `<div class="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Preview Error:</strong> ${error}
        <p class="mt-2 text-sm">Raw content is shown below:</p>
        <pre class="mt-2 p-2 bg-gray-100 overflow-auto text-sm">${escapeHtml(body)}</pre>
      </div>`;
    } finally {
      loading = false;
    }
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
  
  onMount(() => {
    processMarkdown();
  });
  
  // Re-process when body changes
  $: if (body) {
    processMarkdown();
  }
</script>

<div class="post-preview">
  <!-- Header Section -->
  <header class="preview-header mb-8">
    {#if frontmatter.title}
      <h1 class="text-4xl font-bold mb-4">{frontmatter.title}</h1>
    {/if}
    
    <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {#if frontmatter.pubDate || frontmatter.publishDate}
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {formatDate(frontmatter.pubDate || frontmatter.publishDate)}
        </span>
      {/if}
      
      {#if frontmatter.category}
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          {frontmatter.category}
        </span>
      {/if}
      
      {#if frontmatter.tags?.length}
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          {#each frontmatter.tags as tag}
            <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">{tag}</span>
          {/each}
        </div>
      {/if}
    </div>
    
    {#if frontmatter.excerpt}
      <p class="text-xl text-gray-600 dark:text-gray-400">{frontmatter.excerpt}</p>
    {/if}
  </header>
  
  <!-- Loading State -->
  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-3 text-gray-600">Rendering preview...</span>
    </div>
  {/if}
  
  <!-- Preview Content -->
  <div class="preview-content prose prose-lg dark:prose-invert max-w-none">
    {@html html}
  </div>
</div>

<style>
  /* Base typography */
  .preview-content :global(h1) { font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
  .preview-content :global(h2) { font-size: 1.875rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem; }
  .preview-content :global(h3) { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .preview-content :global(h4) { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; }
  
  .preview-content :global(p) { margin-bottom: 1rem; line-height: 1.75; }
  
  .preview-content :global(a) { color: #3b82f6; text-decoration: underline; }
  .preview-content :global(a:hover) { color: #2563eb; }
  
  .preview-content :global(img) { 
    max-width: 100%; 
    height: auto; 
    border-radius: 0.5rem; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 1.5rem auto;
  }
  
  .preview-content :global(blockquote) {
    border-left: 4px solid #d1d5db;
    padding-left: 1rem;
    font-style: italic;
    color: #6b7280;
    margin: 1.5rem 0;
  }
  
  .preview-content :global(code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  .preview-content :global(pre) {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  
  .preview-content :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
  
  .preview-content :global(ul), .preview-content :global(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  .preview-content :global(li) { margin-bottom: 0.5rem; }
  
  .preview-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }
  
  .preview-content :global(th), .preview-content :global(td) {
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    text-align: left;
  }
  
  .preview-content :global(th) {
    background-color: #f9fafb;
    font-weight: 600;
  }
  
  /* Custom directive styles */
  .preview-content :global(details) {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .preview-content :global(summary) {
    cursor: pointer;
    font-weight: 600;
  }
  
  .preview-content :global(.blur-sm) {
    filter: blur(4px);
    transition: filter 0.3s ease;
  }
  
  .preview-content :global(.hover\\:blur-none:hover) {
    filter: blur(0);
  }
  
  /* Grid styles */
  .preview-content :global(.flex) {
    display: flex;
  }
  
  .preview-content :global(.flex-wrap) {
    flex-wrap: wrap;
  }
  
  .preview-content :global(.justify-center) {
    justify-content: center;
  }
  
  .preview-content :global(.gap-4) {
    gap: 1rem;
  }
  
  .preview-content :global(.w-\[calc\\(50\\%-0\\.5rem\\)\]) {
    width: calc(50% - 0.5rem);
  }
  
  @media (min-width: 768px) {
    .preview-content :global(.md\\:w-\[calc\\(33\\.333\\%-0\\.667rem\\)\]) {
      width: calc(33.333% - 0.667rem);
    }
  }
  
  .preview-content :global(.overflow-hidden) {
    overflow: hidden;
  }
  
  .preview-content :global(.rounded-lg) {
    border-radius: 0.5rem;
  }
  
  .preview-content :global(.cursor-zoom-in) {
    cursor: zoom-in;
  }
  
  .preview-content :global(.max-w-full) {
    max-width: 100%;
  }
  
  .preview-content :global(.max-h-full) {
    max-height: 100%;
  }
  
  .preview-content :global(.mx-auto) {
    margin-left: auto;
    margin-right: auto;
  }
  
  .preview-content :global(.object-contain) {
    object-fit: contain;
  }
  
  .preview-content :global(.transition-transform) {
    transition: transform 0.3s ease;
  }
  
  .preview-content :global(.hover\\:scale-\\[1\\.03\\]:hover) {
    transform: scale(1.03);
  }
  
  /* Box directive */
  .preview-content :global([class*="py-4"]) {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .preview-content :global([class*="px-10"]) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
  
  .preview-content :global([class*="my-12"]) {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .preview-content :global(body) {
      background-color: #111827;
      color: #f9fafb;
    }
    
    .preview-content :global(pre) {
      background-color: #1f2937;
    }
    
    .preview-content :global(blockquote) {
      border-color: #4b5563;
      color: #9ca3af;
    }
    
    .preview-content :global(code) {
      background-color: #374151;
    }
    
    .preview-content :global(th) {
      background-color: #1f2937;
    }
    
    .preview-content :global(table),
    .preview-content :global(th),
    .preview-content :global(td) {
      border-color: #4b5563;
    }
  }
</style>
