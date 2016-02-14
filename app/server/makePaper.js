var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');
const blogJSONManager = require('../utils/blogJSONManager');

var _paperFileNames = null;



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
    const title = paper['title'];
    const summary = paper['summary'];
    const texts = paper['texts'];
    const titleImage = paper['titleImage'];
    var tags = paper['tags'];
    const date = paper['date'];

    if (tags.length === 0)
        tags.push('Untagged');

    tags = _.map(tags, function(tag) {
        return tag.replace(/\s+/g, '');
    });

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
        function(paperId, callback) {
            var _blogJSON = blogJSONManager.getBlogJSON();

            _blogJSON['papers'][paperId] = {
                title: title,
                summary: summary,
                titleImage: titleImage,
                tags: tags,
                date: (new Date(date)).toJSON()
            };

            blogJSONManager.updateBlogJSON(_blogJSON, function(err) {
                if (err) callback(err);
                else callback(null);
            });
        }
    ], function(err, res) {
        if (err) _callback(err, null);
        else _callback(null, res);
    });
};

module.exports = makePaper;