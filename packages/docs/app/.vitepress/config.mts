import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

export default defineConfig({
  title: 'Telegram Login Ultimate',
  description:
    'Ultimate tool for working with Telegram Login API with TypeScript support',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Packages',
        items: [
          { text: 'React', link: '/packages/react' },
          { text: 'Vue', link: '/packages/vue' },
          { text: 'Angular', link: '/packages/angular' },
          { text: 'Svelte', link: '/packages/svelte' },
          { text: 'Solid', link: '/packages/solid' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Installation', link: '/installation' },
        ],
      },
      {
        text: 'Packages',
        items: [
          { text: 'React', link: '/packages/react' },
          { text: 'Vue', link: '/packages/vue' },
          { text: 'Angular', link: '/packages/angular' },
          { text: 'Svelte', link: '/packages/svelte' },
          { text: 'Solid', link: '/packages/solid' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/notcodev/telegram-login-ultimate',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/org/telegram-login-ultimate',
      },
    ],
  },
  vite: {
    plugins: [tailwindcss(), groupIconVitePlugin()],
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
})
