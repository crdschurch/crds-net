function manageBlacklist(config){
  // Create Set to avoid/remove duplicates
  const uniqueBlacklist = typeof config.blacklistHosts === 'string'
    ? new Set([config.blacklistHosts])
    : new Set(config.blacklistHosts);

  // Always block Google Tag Manager and stub its calls in the /support/commands file.
  //  If allowed it'll cause lots of 'Cannot get/set property of undefined' console errors
  //  which break tests, possibly because Cypress starts interacting with a page much 
  //  faster than it can fully load.
  uniqueBlacklist.add('www.googletagmanager.com');

  // Block other scripts that occasionally cause problems
  uniqueBlacklist.add('*hotjar.com');
  uniqueBlacklist.add('*.monetate.net');

  config.blacklistHosts = [...uniqueBlacklist];
}

exports.manageBlacklist = manageBlacklist;