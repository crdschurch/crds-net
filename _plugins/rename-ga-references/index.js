const replace = require('replace-in-file')

const pluralize = (str, count) => {
  return `${count} ${str + (count > 1 ? `s` : '')}`
}

module.exports = {
  onPostBuild: ({ constants }) => {
    const results = replace.sync({
      files: `${constants.PUBLISH_DIR}/**/*.html`,
      from: /ga\('/g,
      to: 'abstractedAnalytics(\'',
      countMatches: true,
    });
    const changed = results.filter(f => f.numReplacements > 0)
    const n = changed.reduce((total,n) => parseInt(n.numReplacements) + total, 0)
    console.log(`Replaced ${pluralize('reference', n)} to \`ga(...)\`  across ${pluralize('file', changed.length)}.`)
  },
}
