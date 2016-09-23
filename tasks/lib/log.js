var grunt = require("grunt");

var Log = function() {

};

Log.prototype.constructor = Log;

Log.prototype.info = function(message) {
    grunt.log.ok(message);
};

Log.prototype.error = function(message) {
    grunt.log.error(message);
};