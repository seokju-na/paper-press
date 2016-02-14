var fs = require('fs');
var mkdirp = require('mkdirp');
var async = require('async');

const paths = require('./paths');
const errorCodes = require('./errorCodes');

var checkPapersFolder = function(_callback) {
    async.waterfall([
        function(callback) {
            fs.stat(paths.PAPER_FOLDER, function(err, stats) {
                if (err) callback(null, false);
                else callback(null, true);
            });
        },
        function(isValid, callback) {
            if (isValid) callback(null);
            else
                mkdirp(paths.PAPER_FOLDER, function(err) {
                    if (err) callback(errorCodes.MAKE_PAPER_FOLDER);
                    else callback(null);
                });
        }
    ], function(err,res) {
        if (err) _callback(err);
        else _callback(null);
    });
};

var checkDistFolder = function(_callback) {
    async.waterfall([
        function(callback) {
            fs.stat(paths.DIST_FOLDER, function(err, stats) {
                if (err) callback(null, false);
                else callback(null, true);
            });
        },
        function(isValid, callback) {
            if (isValid) callback(null);
            else
                mkdirp(paths.DIST_FOLDER, function(err) {
                    if (err) callback(errorCodes.MAKE_DIST_FOLDER);
                    else callback(null);
                });
        }
    ], function(err,res) {
        if (err) _callback(err);
        else _callback(null);
    });
};

module.exports = {
    checkPapersFolder: checkPapersFolder,
    checkDistFolder: checkDistFolder
};