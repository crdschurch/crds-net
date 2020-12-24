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
const { manageBlacklist } = require('./blacklistHosts');
const { addContentfulTasks } = require('./contentfulTasks');

//Config files live in /config. To specify which one to use, open or run with command line argument:
//"--config-file ./cypress/config/int_crossroads.json"
module.exports = (on, config) => {
  return loadConfig.loadConfigFromVault(config)
    .then((newConfig) => {
      // Configure blacklisted hosts
      manageBlacklist(newConfig);

      // Add Contentful query tasks
      addContentfulTasks(on, newConfig);
      return newConfig;
    });
};