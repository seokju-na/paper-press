var fs = require('fs');

var makerPaper = require('./makePaper');
var deploy = require('./deploy');

const paths = require('../utils/paths');
const APIRoot = '/api';

exports.doRoutes = function(app) {
    app.get(APIRoot + '/getBlogInfo', getBlogInfo);
    app.get(APIRoot + '/getPaperDataById', getPaperDataById);
    app.post(APIRoot + '/postPaper', postPaper);
    app.post(APIRoot + '/postDeployMessage', postDeployMessage);
};


var getBlogInfo = function(req,res) {
    fs.readFile(paths.BLOG_JSON, 'utf8', function(err, data) {
        if (err) res.status(500).send(err);
        else res.status(200).send({blogInfo: data});
    });
};

var getPaperDataById = function(req,res) {
    var paperId = req.query.paperId;

    fs.readFile(paths.PAPERS + paperId + '.md', 'utf8',
        function(err, data) {
            if (err) res.status(500).send(err);
            else res.status(200).send({paperData: data});
        });
};

var postPaper = function(req,res) {
    var paperId = req.body.paperId;
    var paper = req.body.paper;

    makerPaper(paperId, paper, function(err) {
        if (err) res.status(500).send(err);
        else res.status(200).end();
    });
};

var postDeployMessage = function(req,res) {

};