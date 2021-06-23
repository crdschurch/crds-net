var sass = require('node-sass');
var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var pkgJson = require('../package.json');
var argv = require('yargs').argv;
var AWS = require('aws-sdk');
var tildeImporter = require('node-sass-tilde-importer');
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');
var _ = require('lodash');
var glob = require('glob');

// ------------------------------------------------- |

var CRDS = {};

CRDS.Styles = function() {
  this.setup();
  this.init();
};

CRDS.Styles.prototype.setup = function() {
  var slug = './dist/crds-styles-' + pkgJson.version;
  this.outputFile = slug + '.css';
  this.minOutputFile = slug + '.min.css';
  this.debug = argv.debug || false;
}

CRDS.Styles.prototype.init = function() {
  if(argv.build) {
    this.build();
  } else if(argv.deploy) {
    this.deploy();
  }
}

CRDS.Styles.prototype.bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

CRDS.Styles.prototype.build = function() {
  this.log('build()');
  this.compile('nested');
  this.copySVGs();
  setTimeout(function() {
    this.compile('compressed');
  }.bind(this), 1000);
}

CRDS.Styles.prototype.compile = function(style) {
  this.log('compile()');
  var filename = style == 'compressed' ? this.minOutputFile : this.outputFile;
  sass.render({
    file: './assets/stylesheets/_crds-styles.scss',
    outFile: filename,
    sourceMap: true,
    sourceComment: 'true',
    includePaths: [ 'assets/', 'node_modules/' ],
    importer: tildeImporter,
    outputStyle: style
  }, function(error, result){
    this.onCompile(error, result, filename)
  }.bind(this));
};

CRDS.Styles.prototype.copySVGs = function() {
  fs.mkdir('./dist/svgs');
  glob('./assets/**/*.svg', {}, (err, files) => {
    files.forEach((file) => {
      var filename = this.filenameFromPath(file);
      var newFilename = this.fileBasename(file) + '-' + pkgJson.version + '.' +
                        this.fileExt(file);
      var newFile = './dist/svgs/' + newFilename;
      fs.copySync(path.resolve(__dirname, '../' + file), newFile);
      console.log(newFile);
    });
  });
}

CRDS.Styles.prototype.filenameFromPath = function(path) {
  return _.last(path.split('/'));
}

CRDS.Styles.prototype.fileExt = function(path) {
  return _.last(path.split('.'));
}

CRDS.Styles.prototype.fileBasename = function(path) {
  return this.filenameFromPath(path).replace('.' + this.fileExt(path), '');
}

CRDS.Styles.prototype.onCompile = function(error, result, filename) {
  this.log('onCompile()');
  if (error) {
    this.log(error.status);
    this.log(error.column);
    this.log(error.message);
    this.log(error.line);
  } else {
    fs.ensureDir('./dist')
      .then(function() {
        postcss([ autoprefixer ]).process(result.css).then((css) => {
          css.warnings().forEach((warn) => {
            this.log(warn.toString());
          });
          this.writeFile(css, filename);
          this.writeFile(result.map, filename + '.map');
        });
      }.bind(this))
      .catch(function(err) {
        this.error(err);
      }.bind(this));
  }
};

CRDS.Styles.prototype.writeFile = function(payload, outputFile) {
  this.log('writeFile()');
  fs.writeFile(outputFile, payload, function(err){
    if(!err){
      console.log(outputFile);
    }
  }.bind(this));
}

// ------------------------------------------------- |

CRDS.Styles.prototype.setupS3 = function() {
  AWS.config.update({
    accessKeyId: process.env.CRDS_STYLES_AWS_ACCESS_KEY,
    secretAccessKey: process.env.CRDS_STYLES_AWS_SECRET_KEY
  });
  this.s3 = new AWS.S3();
  this.s3Bucket = process.env.CRDS_STYLES_S3_BUCKET;
  this.existingStyleFiles = this.listObjects('styles/');
  this.existingImageFiles = this.listObjects('images/');
}

CRDS.Styles.prototype.listObjects = function(prefix) {
  this.log('listObjects()');
  this.s3.listObjects({ Bucket: this.s3Bucket, Prefix: prefix }, function(err, data) {
    if (err) {
      console.error(err, err.stack);
    } else {
      this.existingStyleFiles = _.chain(data['Contents'])
        .map('Key')
        .map(function(v) {
          var pattern = prefix;
          return v.replace(new RegExp(pattern), '');
        }.bind(this))
        .compact()
        .value();
    }
  }.bind(this));
};

CRDS.Styles.prototype.fileExists = function(filename) {
  return _.includes(this.existingStyleFiles, filename);
};

CRDS.Styles.prototype.deploy = function() {
  this.log('deploy()');
  this.setupS3();

  var stylesTimer = setInterval(function() {
    if(this.existingStyleFiles) {
      clearInterval(stylesTimer);
      return this.upload('styles/', './dist/*.css*');
    }
  }.bind(this), 300);

  var imagesTimer = setInterval(function() {
    if(this.existingStyleFiles) {
      clearInterval(imagesTimer);
      return this.upload('images/', './dist/**/*.svg');
    }
  }.bind(this), 300);
};

CRDS.Styles.prototype.upload = function(s3Prefix, files) {
  this.log('upload()');
  glob(files, {}, (err, files) => {
    if (err) {
      this.log(err);
    } else {
      files.forEach((file) => {
        this.uploadFile(s3Prefix, file);
      });
    }
  });
}

CRDS.Styles.prototype.uploadFile = function(prefix, filename) {
  this.log('uploadFile()', filename);

  if (this.fileExists(filename) && !argv.force) {
    this.error('[SKIPPING] File already exists: ' + filename);
  } else {
    var stream = fs.createReadStream(filename);
    var ext = path.extname(filename);
    switch (path.extname(filename)) {
      case '.css':
        var mime_type = 'text/css';
        break;
      case '.map':
        var mime_type = 'application/octet-stream';
        break;
      case '.svg':
        var mime_type = 'image/svg+xml';
        break;
    }
    var params = {
      Bucket: this.s3Bucket,
      Key: prefix + this.filenameFromPath(filename),
      ContentType: mime_type,
      Body: stream,
      ACL: 'public-read'
    };
    this.s3.upload(params, (err, data) => {
      console.log(err, data);
    });
  }
}

// ------------------------------------------------- |

CRDS.Styles.prototype.log = function(str) {
  if(this.debug) {
    console.log(str);
  }
}

CRDS.Styles.prototype.error = function(str) {
  console.error(str);
}

new CRDS.Styles();
