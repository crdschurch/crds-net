#!/usr/bin/env node

var fs = require('fs'),
    program = require('commander'),
    cheerio = require('cheerio'),
    input,
    output,
    processed = 0,
    svgContent = [];

program
  .version('0.0.1')
  .arguments('[input] [output]')
  .action(function (i, o) {
     input = i;
     output = o;
  })
  .parse(process.argv);

if (typeof(input) === 'undefined' ||
    typeof(output) === 'undefined') {
  console.error("\n\
---------------------------------\n\
ERROR: Missing required argument.\n\
---------------------------------");
  program.help();
}

function writeFile() {
  var $ = cheerio.load('');
  var outerSvg = $('<svg></svg>')
  outerSvg.attr({
    width: 256,
    height: 256,
    viewBox: '0 0 256 256',
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    'xmlns:xlink': "http://www.w3.org/1999/xlink"
  });
  outerSvg.html(svgContent.join("\n\n"));
  var content = '<?xml version="1.0" encoding="UTF-8"?>\n' + $.html(outerSvg);
  fs.writeFile(output, content, function() {});
}
 
fs.readdir(input, function(error, files) {
  files.forEach(function(file){
    if (file == '.DS_Store' || file == 'README.md') {
      processed++;
      return;
    }

    fs.readFile(input + '/' + file, 'utf8', function(error, data) {
      var $ = cheerio.load(data);
      var name = $('title').text();

      var shape = $.html('path, polygon, circle');

      var svg = $('<svg></svg>')
      svg.attr({ id: name, width: 256, height: 256, viewBox: '0 0 256 256' });
      svg.html('\n  <g>\n    ' + shape + '\n  </g>\n');
      svgContent.push('\n' + $.html(svg));
      processed++;

      if (processed >= files.length) {
        writeFile();
      }
    })
  });
});
