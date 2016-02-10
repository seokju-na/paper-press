var fs = require('fs');

var deletePaper = require('./deletePaper');
var makerPaper = require('./makePaper');
var updateBlogJSON = require('./updateBlogJSON');
var deploy = require('./deploy');

const paths = require('../utils/paths');
const APIRoot = '/api';

exports.doRoutes = function(app) {
    app.get(APIRoot + '/getBlogInfo', getBlogInfo);
    app.get(APIRoot + '/getPaperDataById', getPaperDataById);
    app.post(APIRoot + '/removePaper', removePaper);
    app.post(APIRoot + '/postPaper', postPaper);
    app.post(APIRoot + '/postBlogInfo', postBlogInfo);
    app.post(APIRoot + '/postDeployMessage', postDeployMessage);
};

function errorLog(err) {
    console.log("[ERROR] ".red + (err.toString()).red);
    console.log("  * Read more guide on ".gray +
        "https://github.com/seokju-na/paper-press.git".underline.gray);
}

var getBlogInfo = function(req,res) {
    fs.readFile(paths.BLOG_JSON, 'utf8', function(err, data) {
        if (err) {
            errorLog(err);
            res.status(500).send(err);
        }
        else res.status(200).send({blogInfo: data});
    });
};

var getPaperDataById = function(req,res) {
    var paperId = req.query.paperId;

    fs.readFile(paths.PAPERS + paperId + '.md', 'utf8',
        function(err, data) {
            if (err) {
                errorLog(err);
                res.status(500).send(err);
            }
            else res.status(200).send({paperData: data});
        });
};

var removePaper = function(req,res) {
    var paperId = req.body.paperId;

    deletePaper(paperId, function(err) {
        if (err) {
            errorLog(err);
            res.status(500).send(err);
        }
        else res.status(200).end();
    });
};

var postBlogInfo = function(req,res) {
    var blogInfo = req.body.blogInfo;

    updateBlogJSON(blogInfo, function(err) {
        if (err) {
            errorLog(err);
            res.status(500).send(err);
        }
        else res.status(200).end();
    });
};

var postPaper = function(req,res) {
    var paperId = req.body.paperId;
    var paper = req.body.paper;

    makerPaper(paperId, paper, function(err, paperId) {
        if (err) {
            errorLog(err);
            res.status(500).send(err);
        }
        else res.status(200).send({ paperId: paperId });
    });
};

var postDeployMessage = function(req,res) {
    deploy(function(err) {
        if (err) {
            errorLog(err);
            res.status(500).send(err); }
        else res.status(200).end();
    });
};