// Conventional Commits, em inglês: https://www.conventionalcommits.org
// O release-please usa feat/fix/perf para calcular a versão e montar o CHANGELOG.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      ['cube', 'ui', 'store', 'solver', 'security', 'deps', 'deps-dev', 'ci', 'deploy', 'runner', 'release', 'ai', 'docs'],
    ],
    'body-max-line-length': [1, 'always', 100],
  },
}
