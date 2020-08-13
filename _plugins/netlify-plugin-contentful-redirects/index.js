module.exports = {
  async onPreBuild({ utils: { run } }) {
    await run("mkdir", ["-p", "./tmp"]);
    await run("cp", ["./redirects.csv", "./tmp/.redirects_cache"]);
    await run("./bin/contentful-redirects", ["./tmp/.redirects_cache"]);
  },
};
