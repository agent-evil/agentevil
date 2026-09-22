import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://agentevil.com', output: 'static', trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: page => !/\/404(?:\.html|\/)?$/.test(new URL(page).pathname), i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN', fr: 'fr' } } })],
  i18n: { defaultLocale: 'en', locales: ['en', 'zh', 'fr'], routing: { prefixDefaultLocale: false } },
  vite: { build: { assetsInlineLimit: 0 } }
});
