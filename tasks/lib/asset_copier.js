var Emitter = require('events').EventEmitter;
var fs = require('fs');
var grunt = require('grunt');
var _ = require('lodash');
var path = require('path');
var logger = require("./log");

var Copier = function (assets, options, report) {
  this.assets = assets;
  this.options = options;
  this.report = report;

  grunt.log.writeln("Copier constructor");
  logger = new Log();
};

Copier.prototype = Object.create(Emitter.prototype);
Copier.prototype.constructor = Copier;

Copier.prototype.copy = function () {
  var error;
  _(this.assets).each(function (typedAssets, type) {
    try {
      this.copyAssets(type, typedAssets);
    } catch (err) {
      error = err;
      this.emit('error', err);
      return false;
    }
  }, this);

  if (!error) {
    this.emit('copied');
  }

  return this;
};

Copier.prototype.copyAssets = function (type, assets) {
  var self = this;

  _(assets).each(function (sources, pkg) {
    _(sources).each(function (source) {

      var isFile = grunt.file.isFile(source);
      var destinationDir = path.join(self.options.targetDir, self.options.layout(type, pkg, source));

      if (isFile) {
        var destination = path.join(destinationDir, path.basename(source));
        grunt.file.copy(source, destination);
        grunt.log.writeln("CopyAssets 1");
        logger.info("copied " + source + " => " + destination);
        //grunt.log.writeln("copying ".cyan + "" + source + " -> " + destination.grey);

      } else {
        grunt.file.mkdir(destinationDir);
        grunt.log.writeln("CopyAssets 2");
        logger.info("copied dir " + source + " => " + destinationDir);
        //grunt.log.writeln("copying ".cyan + " dir " + source + " -> " + destination.grey);

        //fs.copySync(source, destination, { clobber: true, dereference: true });
      }
      self.report(source, destinationDir, isFile);
    });
  });
};

module.exports = Copier;
