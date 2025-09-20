import { defineConfig } from 'vitepress'

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
          { text: 'React', link: '/react' },
          { text: 'Vue', link: '/vue' },
          { text: 'Angular', link: '/angular' },
          { text: 'Svelte', link: '/svelte' },
          { text: 'Solid', link: '/solid' },
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
          { text: 'React', link: '/react', items: [] },
          { text: 'Vue', link: '/vue', items: [] },
          { text: 'Angular', link: '/angular', items: [] },
          { text: 'Svelte', link: '/svelte', items: [] },
          { text: 'Solid', link: '/solid', items: [] },
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
})
