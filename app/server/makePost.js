var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');

const postsPath = __dirname + '/../../src/posts';
const blogJSONPath = __dirname + '/../../src/blog.json';

var _postFileNames = null;
var _blogJSON = null;

var updatePostsJSON = function(_callback, post) {
    var postId = post['postId'];

    _blogJSON['posts'][postId] = {
        title: post['title'],
        type: post['type'],
        tags: post['tags']
    };

    fs.writeFile(blogJSONPath, JSON.stringify(_blogJSON), 'utf8', function(err) {
        if (err) throw err;
        _callback(null);
    });
};

var _getPostFileNames = function(_callback) {
    if (_postFileNames !== null) {
        return _callback();
    }

    fs.readdir(postsPath, function(err, files) {
        if (err) throw err;
        _postFileNames = files;
        _callback();
    });
};


var makePost = function(postId, title, type, texts, tags) {
    _blogJSON = require(blogJSONPath);

    var isNewPost = (postId === null);

    async.waterfall([
        function(callback) {
            _getPostFileNames(function() {
                callback(null);
            });
        },
        function(callback) {
            if (isNewPost) {
                var id;

                do {
                    id = shortid.generate();

                } while(_.contains(_postFileNames, id + '.md'));

                callback(null, id);
            }
            else callback(null, postId);
        },
        function(fileName, callback) {
            fs.writeFile(postsPath + '/' + fileName + '.md',
                texts, 'utf8',
                function(err) {
                    if (err) throw err;
                    callback(null, fileName);
                }
            );
        },
        function(fileName, callback) {
            updatePostsJSON(callback, {
                postId: fileName,
                title: title,
                type: type,
                tags: tags
            });
        }
    ], function(err, res) {
        console.log("Post completed saved!");
    });
};

module.exports = makePost;