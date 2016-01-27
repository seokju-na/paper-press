var fs = require('fs');

var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

var Remarkable = require('remarkable');
var md = new Remarkable();

var blog = require('../../src/blog.json');

var postsPath = __dirname + '/../../src/posts';
var htmlDistPath = __dirname + '/../../dist/posts';




var _renderHtml = function(fileData) {
    var renderedMarkdown = md.render(fileData);

    async.waterfall([
        function(callback) {
            fs.readdir(htmlDistPath, function(err, files) {
                if (err) throw err;
                callback(null, files);
            });
        },
        function(fileNames, callback) {
            var _fileNames = _.map(fileNames, function(fileName) {
                return (fileName.split('.'))[0];
            });

            var id = shortid.generate();

            while (_.contains(_fileNames, id))
                id = shortid.generate();

            callback(null, id);
        },
        function(fileName, callback) {
            var dataToWrite;
        }
    ])
};


var execute = function() {
    async.waterfall([
        function(callback) {
            fs.readdir(postsPath, function(err, files) {
                if (err) throw err;
                console.log("Getted Files", files);
                callback(null, files);
            });
        }
    ], function(err, results) {

    });

};


module.exports = execute;