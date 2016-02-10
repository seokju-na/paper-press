var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');

var _paperFileNames = null;
var _blogJSON = null;


function updateBlogJSON(_callback, paper) {
    var paperId = paper['paperId'];

    _blogJSON['papers'][paperId] = {
        title: paper['title'],
        summary: paper['summary'],
        titleImage: paper['titleImage'],
        tags: paper['tags'],
        date: (new Date(paper['date'])).toJSON()
    };

    fs.writeFile(
        paths.BLOG_JSON,
        JSON.stringify(_blogJSON), 'utf8',
        function(err) {
            if (err) _callback(errorCodes.WRITE_BLOG_JSON, null);
            else _callback(null, paperId);
        }
    );
}

function _getPaperFileNames(_callback) {
    if (_paperFileNames !== null) {
        return _callback(null);
    }

    fs.readdir(paths.PAPERS, function(err, files) {
        if (err) _callback(errorCodes.READ_DIR_OF_PAPERS);
        else{
            _paperFileNames = files;
            _callback(null);
        }
    });
}


var makePaper = function(paperId, paper, _callback) {
    _blogJSON = require(paths.BLOG_JSON);

    const title = paper['title'];
    const summary = paper['summary'];
    const texts = paper['texts'];
    const titleImage = paper['titleImage'];
    const tags = paper['tags'];
    const date = paper['date'];

    var isNewPaper = (paperId === null);

    async.waterfall([
        function(callback) {
            _getPaperFileNames(function(err) {
                if (err) callback(err);
                else callback(null);
            });
        },
        function(callback) {
            if (isNewPaper) {
                var id;

                do {
                    id = shortid.generate();
                } while(_.contains(_paperFileNames, id + '.md'));

                callback(null, id);
            }
            else callback(null, paperId);
        },
        function(fileName, callback) {
            fs.writeFile(paths.PAPERS + fileName + '.md',
                texts, 'utf8',
                function(err) {
                    if (err) callback(errorCodes.WRITE_PAPER);
                    else callback(null, fileName);
                }
            );
        },
        function(fileName, callback) {
            updateBlogJSON(callback, {
                paperId: fileName,
                title: title,
                summary: summary,
                titleImage: titleImage,
                tags: tags,
                date: date
            });
        }
    ], function(err, res) {
        if (err) _callback(err, null);
        else _callback(null, res);
    });
};

module.exports = makePaper;