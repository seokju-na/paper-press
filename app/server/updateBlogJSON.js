var _ = require('underscore');

const blogJSONManager = require('../utils/blogJSONManager');


var updateBlogJSON = function(blogInfo, _callback) {
    blogInfo = _.extend(blogInfo, {
        papers: (blogJSONManager.getBlogJSON())['papers']
    });

    blogJSONManager.updateBlogJSON(blogInfo, function(err) {
        if (err) _callback(err);
        else _callback(null);
    });
};

module.exports = updateBlogJSON;