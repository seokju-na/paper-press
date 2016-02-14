var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var ejs = require('ejs');
var htmlmin = require('htmlmin');

const paths = require('../utils/paths');
const colors = require('../utils/colors');
const errorCodes = require('../utils/errorCodes');
const blogJSONManager = require('../utils/blogJSONManager');

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
    var allCount = papers.length;

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
    });

    _callback(tags, tagCount, allCount);
}

function makeDateList() {
    var papers = _blogJSON['papers'];
    var dates = [];

    for (var prop in papers) {
        var date = (function(date) {
            var _date = new Date(date);
            return _date.getFullYear() + "년 " +
                (_date.getMonth() + 1) + "월 " +
                (_date.getDate()) + "일";
        })(papers[prop]['date']);

        dates.push(date);
    }
    return dates;
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

                var dates = makeDateList();

                try {
                    var htmlDistData = ejs.render(htmlData, {
                        blog: _blogJSON,
                        tags: tags,
                        dates: dates,
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
    _blogJSON = blogJSONManager.getBlogJSON();
    _templatePath = paths.TEMPLATES + _blogJSON['template'] + '/';
    _templateConfigJSON = require(_templatePath + 'pp.config.json');

    _receivingData = {};

    _blogJSON['papers'] = _.map(_blogJSON['papers'], function(paper, key) {
        return _.extend(paper, { paperId: key });
    });

    _blogJSON['papers'] = _.sortBy(_blogJSON['papers'], function(paper) {
        var date = new Date(paper['date']);
        return Number("-" + date.getTime());
    });

    _renderIndexHTML(function(err) {
        _blogJSON = null;

        if (err) _callback(err);
        else _callback(null, _receivingData);
    });
};



module.exports = makeIndexPage;