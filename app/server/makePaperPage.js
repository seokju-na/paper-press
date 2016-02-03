var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');
var Remarkable = require('remarkable');
var md = new Remarkable();

const paths = require('../utils/paths');

var _paperTemplateData = null;
var _templateConfigJSON = null;
var _templatePath = null;
var _blogJSON = null;


function _renderHtml(fileName, fileData, _callback) {
    var renderedMarkdown = md.render(fileData);

    async.waterfall([
        function(callback) {
            _getPaperTemplateData(function(data) {
                var blog = _.clone(_blogJSON);
                var paper = blog['papers'][fileName];
                delete blog['papers'];

                var htmlDistData = ejs.render(data, {
                    blog: blog,
                    paper: paper,
                    renderedMarkdown: renderedMarkdown
                });

                callback(null, htmlDistData);
            });
        },
        function(htmlDistData, callback) {
            fileName = fileName.split('.')[0];

            fs.writeFile(paths.DIST + fileName + '.html',
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
}

function _getPaperTemplateData(callback) {
    if (_paperTemplateData !== null) {
        return callback(_paperTemplateData);
    }

    fs.readFile(_templatePath + _templateConfigJSON['templates']['paper'],
        'utf8',
        function(err, data) {
            if (err) throw err;
            _paperTemplateData = data;
            callback(_paperTemplateData);
        });
}

function _renderEachFiles(files, _callback) {
    var tasks = _.map(files, function(fileName) {
        return function(callback) {
            var _fileName = this.fileName;
            fs.readFile(paths.PAPERS + _fileName, 'utf8', function(err, data) {
                _renderHtml(_fileName, data, callback);
            });
        }.bind({ fileName: fileName });
    });

    async.parallel(tasks, function(err, res) {
        if (err) throw err;
        _callback(null);
    });
}


var makeHtml = function() {
    _blogJSON = require(paths.BLOG_JSON);
    _templatePath = paths.TEMPLATES + _blogJSON['template'] + '/';
    _templateConfigJSON = require(_templatePath + 'pp.config.json');

    async.waterfall([
        function(callback) {
            fs.readdir(paths.PAPERS, function(err, files) {
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