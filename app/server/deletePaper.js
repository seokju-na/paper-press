var fs = require('fs');
var async = require('async');
var _ = require('underscore');

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');

var _blogJSON = null;


function _updateBlogJSON(paperId, _callback) {
    delete _blogJSON['papers'][paperId];

    fs.writeFile(paths.BLOG_JSON,
        JSON.stringify(_blogJSON), 'utf8',
        function(err) {
            if (err) _callback(errorCodes.WRITE_BLOG_JSON);
            else _callback(null);
        });
}

var deletePaper = function(paperId, _callback) {
    _blogJSON = require(paths.BLOG_JSON);

    async.waterfall([
        function(callback) {
            fs.unlink(paths.PAPERS + paperId + '.md', function(err) {
                if (err) callback(errorCodes.UNLINK_PAPER);
                else callback(null);
            })
        },
        function(callback) {
            _updateBlogJSON(paperId, function(err) {
                if (err) callback(err);
                else callback(null);
            });
        }
    ], function(err,res) {
        if (err) _callback(err);
        else _callback(null);
    });
};

module.exports = deletePaper;