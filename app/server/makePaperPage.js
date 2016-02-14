var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');
var htmlmin = require('htmlmin');
var Remarkable = require('remarkable');
var hljs = require('highlight.js');
var md = new Remarkable({
    html: true,
    xhtmlOut: false,
    breaks: true,
    linkify: false,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}

        return '';
    }
});

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');
const blogJSONManager = require('../utils/blogJSONManager');

var _paperTemplateData = null;
var _receivedData = null;


function _renderHtml(fileName, fileData, _callback) {
    var renderedMarkdown = md.render(fileData);
    var paperId = fileName.split('.')[0];

    async.waterfall([
        function(callback) {
            _getPaperTemplateData(function() {
                var blog = blogJSONManager.getBlogJSON();
                var paper = blog['papers'][paperId];
                delete blog['papers'];

                var date = (function(date) {
                    var _date = new Date(date);
                    return "- " + _date.getFullYear() + "년 " +
                        (_date.getMonth() + 1) + "월 " +
                        (_date.getDate()) + "일";
                })(paper['date']);

                try {
                    var htmlDistData = ejs.render(_paperTemplateData, {
                        blog: blog,
                        paper: paper,
                        paperId: paperId,
                        tags: _receivedData['tags'],
                        date: date,
                        tagColors: _receivedData['tagColors'],
                        renderedMarkdown: renderedMarkdown
                    });
                } catch(e) {
                    callback(e);
                }

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

    var template = (blogJSONManager.getBlogJSON())['template'];

    var _templatePath = paths.TEMPLATES + template + '/';
    var _templateConfigJSON = require(_templatePath + 'pp.config.json');

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


var makePaperPage = function(receivedData, _callback) {
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