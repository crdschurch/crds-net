module.exports = {
  async onPostBuild({ utils: { run, build } }) {
    try {
      await run("./bin/health-check.sh", [
        "_site/index.html",
        "we are crossroads",
      ]);
      await run("./bin/health-check.sh", [
        "_site/_redirects",
        "/*	/404.html	404",
      ]);
      await run("./bin/health-check.sh", [
        "_site/assets/application.css",
        "Twitter, Inc.",
      ]);
      await run("./bin/health-check.sh", [
        "_site/assets/application.js",
        "jquery.org",
      ]);
      await run("./bin/health-check.sh", [
        "_site/assets/application_deferred.js",
        "use strict",
      ]);
    } catch (e) {
      return build.failBuild(e.stdout);
    }
  },
};
