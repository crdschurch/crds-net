window.CRDS = window.CRDS || {};

CRDS.Environment = class Environment {
  constructor() {
    this.debug = false;
    this.links();
  }

  links() {
    this.log("links()");
    if (this.env() == "int" || this.env() == "demo") {
      $("a[data-href-" + this.env() + "]").each(
        function(i, el) {
          const href = $(el).data("href-" + this.env());
          $(el).attr("href", href);
        }.bind(this)
      );
    }
  }

  env() {
    const mappings = {
      development: "int",
      int: "int",
      demo: "demo",
      release: "demo"
    };
    return mappings[CRDS.env["environment"]];
  }

  log(str) {
    if (this.debug) {
      console.log(str);
    }
  }
};

$(document).ready(function() {
  new CRDS.Environment();
});
