var fs = require('fs');
var async = require('async');
var colors = require('colors');
var _ = require('underscore');
var readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const errorCodes = require('../utils/errorCodes');
const paths = require('../utils/paths');
const templates = require('../utils/templates.json');

function _checkIfHasCorrectBlogInfo() {
    var _hasBlogInfo = true;

    try {
        fs.accessSync(paths.BLOG_JSON);
    } catch(e) {
        _hasBlogInfo = false;
    }

    if (_hasBlogInfo) {
        try {
            var blogJSON = JSON.parse(fs.readFileSync(paths.BLOG_JSON, 'utf8'));
        } catch(e) {
            console.log('Error while reading blog.json'.red);
            console.warn(e);
        }

        if (!(blogJSON.hasOwnProperty('name') &&
            blogJSON.hasOwnProperty('author') &&
            blogJSON.hasOwnProperty('domain') &&
            blogJSON.hasOwnProperty('facebook') &&
            blogJSON.hasOwnProperty('twitter') &&
            blogJSON.hasOwnProperty('github') &&
            blogJSON.hasOwnProperty('template') &&
            blogJSON.hasOwnProperty('disqus') &&
            blogJSON.hasOwnProperty('email') &&
            blogJSON.hasOwnProperty('papers'))) _hasBlogInfo = false;
    }

    return _hasBlogInfo;
}

function _logBlogJSON(obj) {
    for (var prop in obj)
        console.log("  * ".gray + (prop.toString()).gray + " : ".gray + (obj[prop].toString()).gray);
}


var makeBlogJSON = function(_callback) {
    if (!_checkIfHasCorrectBlogInfo()) {
        var newBlogInfo = {};

        console.log("[paper-press]".green + " Making blog configure file.");
        console.log("  * Need your(author) and your blog's info to make blog configure file.".gray);
        console.log("  * Need ".gray + "disqus URL".bold.gray + " to use comment plugin.".gray);
        console.log("  * Read more guide on ".gray + "https://github.com/seokju-na/paper-press.git".underline.gray);
        console.log(" ");

        async.waterfall([
            function(callback) {
                rl.question("- What's your blog name?: ", function(answer) {
                    if (_.isEmpty(answer)) answer = 'My Blog';
                    newBlogInfo['name'] = answer;
                    callback(null);
                });
            },
            function(callback) {
                rl.question("- What's your(author) name?: ", function(answer) {
                    if (_.isEmpty(answer)) answer = 'Mr. Na';
                    newBlogInfo['author'] = answer;
                    callback(null);
                });
            },
            function(callback) {
                rl.question("- What's your email?: ", function(answer) {
                    if (_.isEmpty(answer)) answer = 'na@my.domain.com';
                    newBlogInfo['email'] = answer;
                    callback(null);
                });
            },
            function(callback) {
                rl.question(
                    "- What's your facebook ID? (If your don't have, skip this question): ",
                    function(answer) {
                        newBlogInfo['facebook'] = answer;
                        callback(null);
                    });
            },
            function(callback) {
                rl.question(
                    "- What's your twitter ID? (If your don't have, skip this question): ",
                    function(answer) {
                        newBlogInfo['twitter'] = answer;
                        callback(null);
                    });
            },
            function(callback) {
                rl.question(
                    "- What's your github ID? (If your don't have, skip this question): ",
                    function(answer) {
                        newBlogInfo['github'] = answer;
                        callback(null);
                    });
            },
            function(callback) {
                rl.question("- What's your Disqus URL? \n" +
                    "  Notice paper-press use disqus for comment plugin. \n".gray +
                    "  You should make your unique disqus URL. \n".gray +
                    "  Please read more guide on ".gray +
                    "https://github.com/seokju-na/paper-press.git".underline.gray +
                    ") : ",
                    function(answer) {
                        if (answer.search('.disqus.com') !== -1) answer = answer.split('.')[0];
                        newBlogInfo['disqus'] = answer;
                        callback(null);
                    });
            },
            function(callback) {
                rl.question("- Which template will you use? [default]: ", function(answer) {
                    if (answer == '' || !answer)
                        newBlogInfo['template'] = 'default';
                    else newBlogInfo['template'] = answer;

                    if (!_.contains(templates, answer)) answer = 'default';

                    callback(null);
                });
            },
            function(callback) {
                rl.question("- Enter your domain to use. \n" +
                    "  Notice that surge is your blog CDN. Your domain will be looks ".gray +
                    "example.surge.sh \n".bold.gray +
                    "  To make custom domain, please read more guide on ".gray +
                    "https://github.com/seokju-na/paper-press.git".underline.gray +
                    ") : ",
                    function(answer) {
                        newBlogInfo['domain'] = answer;
                        callback(null);
                    });
            },
            function(callback) {
                console.log(" ");
                console.log("About to write 'blog.json': ");
                console.log(" ");
                _logBlogJSON(newBlogInfo);
                console.log(" ");
                rl.question("Is it ok? (y/n): ", function(answer) {
                    if (answer === 'Y' || answer === 'y' ||
                        answer === 'yes' || answer === 'YES' ||
                        answer === 'Yes') {
                            newBlogInfo['papers'] = {};
                            callback(null);
                        }
                    else callback(errorCodes.ABORTED);
                });
            },
            function(callback) {
                fs.writeFile(paths.BLOG_JSON,
                    JSON.stringify(newBlogInfo), 'utf8',
                    function(err) {
                        if (err) callback(errorCodes.WRITE_BLOG_JSON);
                        else {
                            console.log("Blog configure file successfully saved in " +
                                "src/blog.json".bold + "!");
                            console.log(" ");
                            callback(null);
                        }
                    }
                );
            }
        ], function(err, res) {
            if (err) _callback(err);
            else _callback(null);
        });
    }
    else _callback(null);
};

module.exports = makeBlogJSON;