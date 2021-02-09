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
    } catch (e) {
      return build.failBuild(e.stdout);
    }
  },
};
