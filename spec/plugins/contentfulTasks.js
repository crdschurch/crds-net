const contentfulPlugin = require('crds-cypress-contentful');

function addContentfulTasks(on, config) {
  const spaceId = config.env.CONTENTFUL_SPACE_ID;
  const environment = config.env.CONTENTFUL_ENV;
  const accessToken = config.env.CONTENTFUL_ACCESS_TOKEN;

  const qp = contentfulPlugin.ContentfulQueryPlugin(spaceId, environment, accessToken);
  on('task', qp);
}

exports.addContentfulTasks = addContentfulTasks;