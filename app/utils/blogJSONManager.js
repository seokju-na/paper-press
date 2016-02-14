var fs = require('fs');
var _ = require('underscore');

const paths = require('./paths');
const errorCodes = require('./errorCodes');

var _blogJSON = null;

const blogJSONManager = {
    getBlogJSON: function() {
        return _.clone(_blogJSON);
    },

    initBlogJSON: function(initBlogJSON) {
        _blogJSON = _.clone(initBlogJSON);
    },

    updateBlogJSON: function(newBlogJSON, _callback) {
        _blogJSON = newBlogJSON;

        fs.writeFile(paths.BLOG_JSON,
            JSON.stringify(newBlogJSON), 'utf8',
            function(err) {
                if (err) _callback(errorCodes.WRITE_BLOG_JSON);
                else _callback(null);
            });
    }
};

module.exports = blogJSONManager;