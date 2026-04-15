/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'remark-link-card' {
  import { Plugin } from 'unified';
  const remarkLinkCard: Plugin;
  export default remarkLinkCard;
}

declare module 'rehype-sanitize' {
  import { Plugin } from 'unified';
  import { Schema } from 'hast-util-sanitize';
  
  export const defaultSchema: Schema;
  
  interface SanitizePluginOptions {
    schema?: Schema;
  }
  
  const rehypeSanitize: Plugin<[SanitizePluginOptions?]>;
  export default rehypeSanitize;
}
