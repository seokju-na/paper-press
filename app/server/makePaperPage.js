var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');
var htmlmin = require('htmlmin');
var Remarkable = require('remarkable');
var md = new Remarkable();

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');

var _paperTemplateData = null;
var _templateConfigJSON = null;
var _templatePath = null;
var _blogJSON = null;

var _receivedData = null;


function _renderHtml(fileName, fileData, _callback) {
    var renderedMarkdown = md.render(fileData);
    var paperId = fileName.split('.')[0];

    async.waterfall([
        function(callback) {
            _getPaperTemplateData(function(data) {
                var blog = _.clone(_blogJSON);
                var paper = blog['papers'][paperId];
                delete blog['papers'];

                var htmlDistData = ejs.render(data, {
                    blog: blog,
                    paper: paper,
                    tags: _receivedData['tags'],
                    tagColors: _receivedData['tagColors'],
                    renderedMarkdown: renderedMarkdown
                });

                callback(null, htmlDistData);
            });
        },
        function(htmlDistData, callback) {
            fileName = fileName.split('.')[0];

            fs.writeFile(paths.DIST + paperId + '.html',
                htmlmin(htmlDistData), 'utf8',
                function(err) {
                    if (err) callback(errorCodes.WRITE_PAPER_HTML);
                    else callback(null, paperId);
                });
        }
    ], function(err, res) {
        if (err) _callback(err);
        else _callback(null);
    });
}

function _getPaperTemplateData(callback) {
    if (_paperTemplateData !== null) {
        return callback(null);
    }

    fs.readFile(_templatePath + _templateConfigJSON['templates']['paper'],
        'utf8',
        function(err, data) {
            if (err) callback(errorCodes.READ_PAPER_HTML);
            else {
                _paperTemplateData = data;
                callback(null);
            }
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
        if (err) _callback(err);
        else _callback(null);
    });
}


var makePaperPage = function(err, receivedData, _callback) {
    if (err) {
        _callback(err);
        return;
    }

    _blogJSON = require(paths.BLOG_JSON);
    _templatePath = paths.TEMPLATES + _blogJSON['template'] + '/';
    _templateConfigJSON = require(_templatePath + 'pp.config.json');

    _receivedData = receivedData;

    async.waterfall([
        function(callback) {
            fs.readdir(paths.PAPERS, function(err, files) {
                if (err) callback(errorCodes.READ_DIR_OF_PAPERS);
                callback(null, files);
            });
        },
        function(files, callback) {
            _renderEachFiles(files, callback);
        }
    ], function(err, res) {
        if (err) _callback(err);
        else _callback(null);
    });
};


module.exports = makePaperPage;