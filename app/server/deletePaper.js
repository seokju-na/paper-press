var fs = require('fs');
var async = require('async');
var _ = require('underscore');

const paths = require('../utils/paths');
const errorCodes = require('../utils/errorCodes');
const blogJSONManager = require('../utils/blogJSONManager');


var deletePaper = function(paperId, _callback) {
    async.waterfall([
        function(callback) {
            fs.unlink(paths.PAPERS + paperId + '.md', function(err) {
                if (err) callback(errorCodes.UNLINK_PAPER);
                else callback(null);
            })
        },
        function(callback) {
            var _blogJSON = blogJSONManager.getBlogJSON();
            delete _blogJSON['papers'][paperId];

            blogJSONManager.updateBlogJSON(_blogJSON, function(err) {
                if (err) callback(err);
                else callback(null);
            })
        }
    ], function(err,res) {
        if (err) _callback(err);
        else _callback(null);
    });
};

module.exports = deletePaper;