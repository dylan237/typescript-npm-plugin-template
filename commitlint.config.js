// eslint-disable-next-line import/no-extraneous-dependencies
const getConfig = require('commitlint-config-cz/lib/config').get
const czConfig = require('./.cz-config')

const defaultConfig = {
  extents: ['cz'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always'],
  },
}

const config = getConfig(czConfig, defaultConfig)

module.exports = config
