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

const loadConfig = require('crds-cypress-config');
const contentfulPlugin = require('crds-cypress-contentful');

function addContentfulTasks(on, config) {
  const spaceId = config.env.CONTENTFUL_SPACE_ID;
  const environment = config.env.CONTENTFUL_ENV;
  const accessToken = config.env.CONTENTFUL_ACCESS_TOKEN;

  const qp = contentfulPlugin.ContentfulQueryPlugin(spaceId, environment, accessToken);
  on('task', qp);
}

//Config files live in /config. To specify which one to use, open or run with command line argument:
//"--env useConfig=demo_crossroads"
module.exports = (on, config) => {
  return loadConfig.loadConfigFromVault(config)
    .then(newConfig => {
      addContentfulTasks(on, newConfig);
      return newConfig;
    });
};