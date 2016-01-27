var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');

//var htmlmin = require('htmlmin');

var Remarkable = require('remarkable');
var md = new Remarkable();

const postsPath = __dirname + '/../../src/posts';
const templatesPath = __dirname + '/../../src/templates';
const htmlDistPath = __dirname + '/../../dist';

var _postTemplateData = null;
var _blogJSON = null;



/**
 *
 * @param fileData: Markdown File Data
 * @return Success or Failed for write data
 */
var _renderHtml = function(fileName, fileData, _callback) {
    var renderedMarkdown = md.render(fileData);

    async.waterfall([
        function(callback) {
            _getTemplateFileData(function(data) {
                var blog = _.clone(_blogJSON);
                delete blog['posts'];

                var htmlDistData = ejs.render(data, {
                    blog: blog,
                    post: {
                        title: 'Test'
                    },
                    renderedMarkdown: renderedMarkdown
                });

                callback(null, htmlDistData);
            });
        },
        function(htmlDistData, callback) {
            fileName = fileName.split('.')[0];

            fs.writeFile(htmlDistPath + '/' + fileName + '.html',
                htmlDistData, 'utf8',
                function(err) {
                    if (err) throw err;
                    callback(null, fileName);
                });
        }
    ], function(err, res) {
        if (err) throw err;
        console.log(res + '.html File Saved Successful!');
        _callback(null);
    });
};

var _getTemplateFileData = function(callback) {
    if (_postTemplateData !== null) {
        return callback(_postTemplateData);
    }

    fs.readFile(templatesPath + '/post.ejs', 'utf8', function(err, data) {
        if (err) throw err;
        _postTemplateData = data;
        callback(_postTemplateData);
    });
};

var _renderEachFiles = function(files, _callback) {
    var tasks = _.map(files, function(fileName) {
        return function(callback) {
            var _fileName = this.fileName;
            fs.readFile(postsPath + '/' + _fileName, 'utf8', function(err, data) {
                _renderHtml(_fileName, data, callback);
            });
        }.bind({ fileName: fileName });
    });

    async.parallel(tasks, function(err, res) {
        if (err) throw err;
        _callback(null);
    });
};


var makeHtml = function() {
    _blogJSON = require('../../src/blog.json');

    async.waterfall([
        function(callback) {
            fs.readdir(postsPath, function(err, files) {
                if (err) throw err;
                callback(null, files);
            });
        },
        function(files, callback) {
            _renderEachFiles(files, callback);
        }
    ], function(err, res) {
        if (err) throw err;
        console.log("Done for callback hell!");
    });
};


module.exports = makeHtml;