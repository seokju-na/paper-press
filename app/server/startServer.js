const express = require('express');
const bodyParser = require('body-parser');
const paths = require('../utils/paths');
const colors = require('colors');

var apiRoutes = require('./apiRoutes');
var app = null;

var startServer = function(callback) {
    app = express();

    app.engine('.html', require('ejs').__express);
    app.set('views', paths.CLIENT);
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(paths.CLIENT));
    app.use(express.static(paths.IMGS));

    app.get('/', function(req,res) {
        res.render('index');
    });

    apiRoutes.doRoutes(app);

    app.listen(8888);
    console.log("  * Running on http://127.0.0.1:8888/ ".bold.gray + "(Press CTRL+C to quit)".grey);

    callback(null);
};

module.exports = startServer;