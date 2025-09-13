import { eslint } from '@notcodev/eslint'

export default eslint({
  type: 'lib',
  react: {
    overrides: {
      'react/no-context-provider': 'off',
      'react/no-use-context': 'off',
    },
  },
  typescript: true,
  ignores: ['playground/**/*'],
})
