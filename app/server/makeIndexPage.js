var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');
var htmlmin = require('htmlmin');

const paths = require('../utils/paths');
const colors = require('../utils/colors');
const errorCodes = require('../utils/errorCodes');

var _blogJSON = null;
var _templateConfigJSON = null;
var _templatePath = null;
var _indexHTMLData = null;

var _receivingData = null;


function _getHTMLData(_callback) {
    if (_indexHTMLData !== null)
        return _callback();

    async.waterfall([
        function(callback) {
            fs.readFile(_templatePath + _templateConfigJSON['templates']['index'],
                'utf8', function(err, data) {
                    if (err) callback(errorCodes.READ_PAPER_HTML);
                    else {
                        _indexHTMLData = data;
                        callback(null);
                    }
                });
        }
    ], function(err, res) {
        if (err) _callback(err);
        else _callback(null);
    });
}


function _makeTagData(_callback) {
    var papers = _blogJSON['papers'];
    var tags = [];
    var tagCount = 0;
    var allCount = 0;

    function invoke(tagName) {
        var isNew = true;

        for (var idx=0, len=tags.length; idx<len; idx++) {
            if (tags[idx]['name'] === tagName) {
                isNew = false;
                tags[idx]['count']++;
                break;
            }
        }

        if (isNew) {
            tags.push({
                name: tagName,
                count: 1
            });
        }
    }

    for (var prop in papers) {
        var paper = papers[prop];
        for (var idx=0, len=paper['tags'].length; idx<len; idx++)
            invoke(paper['tags'][idx]);
    }

    tags = _.sortBy(tags, function(tag) {
        return Number("-" + tag.count);
    });

    _.each(tags, function(tag) {
        tagCount++;
        allCount += tag['count'];
    });

    _callback(tags, tagCount, allCount);
}

function _renderIndexHTML(_callback) {
    async.waterfall([
        function(callback) {
            _getHTMLData(function(err) {
                if (err) callback(err);
                else callback(null, _indexHTMLData);
            });
        },
        function(htmlData, callback) {
            _makeTagData(function(tags, tagCount, tagAllCount) {
                _receivingData['tags'] = tags;
                _receivingData['tagColors'] = colors(tagCount);

                try {
                    var htmlDistData = ejs.render(htmlData, {
                        blog: _blogJSON,
                        tags: tags,
                        tagColors:  _receivingData['tagColors'],
                        tagAllCount: tagAllCount
                    });
                } catch (e) {
                    console.log(e);
                    callback(e);
                }

                callback(null, htmlDistData);
            });
        },
        function(htmlDistData, callback) {
            fs.writeFile(paths.DIST + 'index.html',
                htmlmin(htmlDistData), 'utf8',
                function(err) {
                    if (err) callback(errorCodes.WRITE_PAPER_HTML);
                    else callback(null);
                }
            );
        }
    ], function(err, res) {
        if (err) _callback(err);
        else _callback(null);
    });
}


var makeIndexPage = function(_callback) {
    _blogJSON = require(paths.BLOG_JSON);
    _templatePath = paths.TEMPLATES + _blogJSON['template'] + '/';
    _templateConfigJSON = require(_templatePath + 'pp.config.json');

    _receivingData = {};

    _renderIndexHTML(function(err) {
        if (err) _callback(err);
        else _callback(null, _receivingData);
    });
};



module.exports = makeIndexPage;