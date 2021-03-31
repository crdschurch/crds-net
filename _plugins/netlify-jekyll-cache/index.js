// This is the main file for the Netlify Build plugin {{name}}.
// Please read the comments to learn more about the Netlify Build plugin syntax.
// Find more information in the Netlify documentation.

/* eslint-disable no-unused-vars */
module.exports = {
   // Restore file/directory cached in previous builds.
  // Does not do anything if:
  //  - the file/directory already exists locally
  //  - the file/directory has not been cached yet
  async onPreBuild({ utils }) {
    await utils.cache.restore('./site')
  },
  // Cache file/directory for future builds.
  // Does not do anything if:
  //  - the file/directory does not exist locally
  async onPostBuild({ utils }) {
    await utils.cache.save('./site')
  },
}
