import { visit } from 'unist-util-visit';

/**
 * Adds support for image sizing and alignment using URL fragments.
 * - `!alt` for inline images.
 * - `!alt` for a 25x25px image.
 * - `!alt` for a 25x50px image.
 * - `!alt` for a 25x25px inline image.
 */
export function remarkSmartImages() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const [url, hash] = node.url.split('#');
      if (!hash) return;

      node.url = url; // Clean the URL from the hash
      const classes = ['my-0']; // Default: no vertical margin for all # images

      if (hash.includes('inline')) {
        classes.push('inline-block', 'align-middle');
      }

      // SAFE MERGE: Do not destroy existing node.data which MDX needs to compile!
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};

      const sizeMatch = hash.match(/(\d+)x?(\d+)?/);
      if (sizeMatch) {
        const width = sizeMatch[1];
        const height = sizeMatch[2] || width; // Use width for height if not specified
        node.data.hProperties.style = `width: ${width}px; height: ${height}px;`;
      }

      const existingClass = node.data.hProperties.class || '';
      node.data.hProperties.class = `${existingClass} ${classes.join(' ')}`.trim();
    });
  };
}

/**
 * Adds support for :::details[summary] and :::grid containers.
 */
export function remarkCustomDirectives() {
  return (tree) => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], (node) => {
      const data = node.data || (node.data = {});

      if (node.name === 'details') {
        data.hName = 'details';
        data.hProperties = data.hProperties || {};
        data.hProperties.class = 'p-4 my-4 bg-gray-50 dark:bg-slate-800 rounded-lg';

        // The directive's label `[My Summary]` becomes the content of the <summary> tag.
        // remark-directive places it inside a paragraph as the first child.
        const summaryParagraph = node.children[0];
        if (summaryParagraph && summaryParagraph.type === 'paragraph') {
          // Change the paragraph to a summary
          summaryParagraph.data = summaryParagraph.data || {};
          summaryParagraph.data.hName = 'summary';
          summaryParagraph.data.hProperties = { class: 'cursor-pointer font-bold' };
        }
      }

      if (node.name === 'box') {
        data.hName = 'div';
        data.hProperties = data.hProperties || {};
        data.hProperties.class = 'py-4 px-10 my-12 bg-gray-50 dark:bg-slate-800 rounded-lg w-fit mx-auto min-w-[250px] max-w-full shadow-sm';

        // The directive's label `[My Heading]` becomes a bold heading text
        const labelParagraph = node.children[0];
        if (labelParagraph && labelParagraph.type === 'paragraph' && labelParagraph.data && labelParagraph.data.directiveLabel) {
          labelParagraph.data.hName = 'div';
          labelParagraph.data.hProperties = { class: 'font-bold mb-2 pb-1 border-b border-gray-200 dark:border-gray-700 text-center px-12' };
        }
      }

      if (node.name === 'grid') {
        data.hName = 'div';
        data.hProperties = data.hProperties || {};
        data.hProperties.class = 'mt-8 mb-12'; // Add more margin at the bottom

        const gridId = Math.random().toString(36).substring(2, 9); // Create a unique ID for this specific grid
        const newChildren = [];
        const gridCells = [];
        let headerNode = null;

        // Iterate through the paragraphs inside the :::grid block
        for (const child of node.children) {
          // Extract the label if it exists (e.g., :::grid[My Grid Title])
          if (child.data && child.data.directiveLabel) {
            child.data.hName = 'h4';
            child.data.hProperties = { class: 'w-full text-center font-semibold text-xl md:text-2xl mb-6 pb-2 border-b border-gray-200 dark:border-gray-700' };
            headerNode = child;
            continue;
          }

          if (child.type === 'paragraph') {
            // Iterate through the items inside the paragraph (images, text nodes)
            for (const item of child.children) {
              // Skip empty text nodes (like newlines between images) and break nodes
              if ((item.type === 'text' && item.value.trim() === '') || item.type === 'break') continue;
  
              // Find the actual image node, whether it's standalone or in a link
              const imageNode = item.type === 'image' ? item : (item.type === 'link' && item.children?.[0]?.type === 'image' ? item.children[0] : null);
  
              let cellContent = item;

              // If we found an image, style it to fill its container
              if (imageNode) {
                  imageNode.data = imageNode.data || {};
                  imageNode.data.hProperties = imageNode.data.hProperties || {};
                  const existingClasses = imageNode.data.hProperties.class || '';
                  // Add a hover effect, prevent clipping by using object-contain, and center it
                  imageNode.data.hProperties.class = `${existingClasses} max-w-full max-h-full mx-auto rounded-lg shadow-sm object-contain transition-transform duration-300 hover:scale-[1.03]`.trim();
                  
                  // Wrap the image in a lightbox link, grouped by the unique grid ID
                  const imgSrc = imageNode.url;
                  cellContent = {
                    type: 'link',
                    url: imgSrc,
                    data: {
                      hName: 'a',
                      hProperties: {
                        href: imgSrc,
                        'data-fancybox': `grid-${gridId}`,
                        'data-type': 'image',
                        class: 'cursor-zoom-in flex items-center justify-center w-full h-full'
                      }
                    },
                    children: [imageNode]
                  };
              }
              
              // **The Fix:** Wrap each item (image or link-with-image) in its own div to act as a grid cell.
              gridCells.push({
                type: 'paragraph', // Use a block-level type that remark understands
                data: { hName: 'div', hProperties: { class: 'flex items-center justify-center w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] overflow-hidden rounded-lg' } }, // Render this node as a <div>
                children: [cellContent],
              });
            }
          } else {
            // Preserve non-paragraph children so we don't accidentally drop blocks
            newChildren.push(child);
          }
        }

        // Add the parsed label to the very top, if provided
        if (headerNode) {
          newChildren.unshift(headerNode);
        }

        // Add the flex container housing all the images
        if (gridCells.length > 0) {
          newChildren.push({
            type: 'paragraph',
            data: { hName: 'div', hProperties: { class: 'not-prose flex flex-wrap justify-center gap-4 mx-auto' } },
            children: gridCells
          });
        }

        // Replace the grid's children with our new set of divs
        node.children = newChildren;
      }

      if (node.name === 'spoiler') {
        data.hName = node.type === 'textDirective' ? 'span' : 'div';
        data.hProperties = data.hProperties || {};
        data.hProperties.class = 'blur-sm hover:blur-none transition-all duration-300 cursor-pointer select-none bg-gray-200 dark:bg-gray-700 px-1 rounded';
      }
    });
  };
}