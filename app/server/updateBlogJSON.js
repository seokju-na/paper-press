var fs = require('fs');
var _ = require('underscore');

const errorCodes = require('../utils/errorCodes');
const paths = require('../utils/paths');

var _blogJSON = null;


var updateBlogJSON = function(blogInfo, _callback) {
    _blogJSON = require(paths.BLOG_JSON);

    blogInfo = _.extend(blogInfo, {
        papers: _blogJSON['papers']
    });

    fs.writeFile(paths.BLOG_JSON,
        JSON.stringify(blogInfo), 'utf8',
        function(err) {
            if (err) _callback(errorCodes.WRITE_BLOG_JSON);
            else _callback(null);
        });
};

module.exports = updateBlogJSON;