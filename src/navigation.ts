import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Blog',
      href: getBlogPermalink(),
    }
  ],
};

export const footerData = {
  links: [],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Reddit', icon: 'tabler:brand-reddit', href: 'https://www.reddit.com/user/Dev-in-the-Bm/' },
    { ariaLabel: 'Jtech Forums', text: '<img src="https://github.com/Dev-in-the-BM/Dev-in-the-BM.github.io/blob/main/Assets/Jtech%20logo%20cropped.png?raw=true" alt="Jtech Forums logo" class="w-5 h-5 opacity-65 invert dark:invert-0" />', href: 'https://forums.jtechforums.org/u/dev-in-the-bm_2.0/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/Dev-in-the-BM/AstroAuthor/' },
  ],
  footNote: `
    Made by <a class="text-blue-600 dark:text-muted" href="https://github.com/Dev-in-the-BM"> Dev-in-the-BM</a> · All rights reserved.
  `,
};
