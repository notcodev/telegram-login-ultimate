const { configure, presets } = require('eslint-kit')

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  extends: '../../.eslintrc.js',
  presets: [presets.typescript(), presets.react()],
})
