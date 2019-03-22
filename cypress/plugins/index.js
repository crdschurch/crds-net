// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// module.exports = (on, config) => {
//   //default - plugin index needs to export at least one module, even if empty
// };

//Workaround below from https://github.com/cypress-io/cypress-browserify-preprocessor/issues/19
const browserify = require('@cypress/browserify-preprocessor');

module.exports = (on) => {
  const options = browserify.defaultOptions;
  const babelOptions = options.browserifyOptions.transform[1][1];
  babelOptions.global = true;
  // ignore all modules except files in crds-cypress-tools
  babelOptions.ignore = [/\/node_modules\/(?!crds-cypress-tools\/)/];
  on('file:preprocessor', browserify(options));
};