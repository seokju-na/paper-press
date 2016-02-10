var fs = require('fs');
var exec = require('child_process').exec;
var async = require('async');

const paths = require('../utils/paths');
const checkSurgeLogin = require('../utils/checkSurgeLogin');
const errorCodes = require('../utils/errorCodes');

var makeIndexPage = require('./makeIndexPage');
var makePaperPage = require('./makePaperPage');

var _blogJSON = null;

var deploy = function(_callback) {

    async.waterfall([
        function(callback) {
            fs.readFile(paths.BLOG_JSON, 'utf8', function(err, data) {
                if (err) callback(errorCodes.READ_BLOG_JSON);
                else {
                    _blogJSON = JSON.parse(data);
                    callback(null);
                }
            });
        },

        function(callback) {
            makeIndexPage(function(err, data) {
                if (err) callback(err);
                else callback(null, data);
            });
        },

        function(data, callback) {
            makePaperPage(data, function(err) {
                if (err) callback(err);
                else callback(null);
            });
        },

        function(callback) {
            exec(paths.GULP, function(err, stdout, stderr) {
                if (err) callback(errorCodes.GULP_BUILD);
                else callback(null);
            });
        },

        function(callback) {
            checkSurgeLogin(function(isLogin) {
                if (isLogin) callback(null);
                else callback(errorCodes.SURGE_LOGIN);
            });
        },

        function(callback) {
            exec(paths.SURGE + ' -p ' + paths.DIST + ' -d ' + _blogJSON['domain'],
                function(err, stdout, stderr) {
                    if (err) callback(errorCodes.SURGE_DEPLOY);
                    else callback(null);
                });
        }

    ], function(err, res) {
        if (err) _callback(err);
        else {
            console.log("[paper-press] ".green + "" +
                "Blog deployed on " + "http://".bold +
                (_blogJSON['domain'].toString()).bold);
            _callback(null);
        }
    });
};

module.exports = deploy;