/* example: https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js */

module.exports = {
  types: [
    {
      value: 'feat',
      name: 'â¨  feat:      æ°åè½',
    },
    {
      value: 'fix',
      name: 'ð  fix:       é¯èª¤ä¿®å¾©',
    },
    {
      value: 'docs',
      name: 'ðï¸   docs:      æä»¶ç¸éæ´æ¹',
    },
    {
      value: 'refactor',
      name: 'ð    refactor:  ç¡ä¿®å¾©é¯èª¤ä¸ç¡æ·»å æ°åè½çæ´æ¹',
    },
    {
      value: 'perf',
      name: 'ð  perf:      æåæè½çæ´æ¹',
    },
    {
      value: 'test',
      name: 'ð  test:      å¢å æ¸¬è©¦æç¾æçæ¸¬è©¦æ´æ¹',
    },
    {
      value: 'build',
      name: 'ð­  build:     å½±é¿ build system ææ¯å¤é¨ä¾è³´çæ´æ¹ï¼å¦ npmãgulp..ç­',
    },
    {
      value: 'chore',
      name: 'ð¯   chore:     å¶ä»ä¸æä¿®æ¹ src ææ¸¬è©¦æä»¶çæ´æ¹',
    },
    {
      value: 'docs',
      name: 'ð  docs:      æä»¶ç¸é',
    },
    {
      value: 'revert',
      name: 'âª  revert:    Revert a previous commit',
    },
    {
      value: 'WIP',
      name: 'ðª  WIP:       é²è¡ä¸­å°æªå®æ',
    },
  ],
  // message  é©è­è¦åæªæ¡: commitlint.config.js
  messages: {
    type: '[type] æ´æ¹çç¨®é¡ (å¿å¡«):',
    scope: '[scope] æ´æ¹çä½ç¨ç¯å (å¯é¸):',
    customScope: '[customScope] Denote the SCOPE of this change (å¯é¸/å°å¯«):',
    subject: '[subject] æ¨é¡ (å¿å¡«):',
    body: '[body] è©³ç´°æè¿° (ä½¿ç¨ | æ¢è¡) (å¯é¸):',
    // æè®èçç¨å¼ç¡æ³éè¡çæ´æ°
    breaking: '[breaking] Breaking Changes æè¿° (å¯é¸):',
    footer: '[footer] ç¸é issues é£çµ (å¯é¸):',
    confirmCommit: 'ç¢ºèªæäº¤? (y/N)',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'chore'],
  subjectLimit: 100,
  skipQuestions: ['scope'],
  footerPrefix: 'ç¸éISSUE:'
  // scopes: [
  //   { name: 'scope1' },
  //   { name: 'scope2' },
  //   { name: 'scope3' },
  // ],
  // scopeOverrides: {
  //   fix: [
  //     { name: 'fixScope1' },
  //     { name: 'fixScope2' },
  //     { name: 'fixScope3' },
  //   ]
  // },
}
