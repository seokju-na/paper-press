#! /usr/bin/env node

const async = require('async');
const exec = require('child_process').exec;
const errorCodes = require('./utils/errorCodes');
const colors = require('colors');

const paths = require('./utils/paths');
const checkFolders = require('./utils/checkFolders');
const checkSurgeLogin = require('./utils/checkSurgeLogin');

var startServer = require('./server/startServer');
var makeBlogJSON = require('./server/makeBlogJSON');

var option = process.argv.slice(2)[0];

switch(option) {
    case 'img':
        openImageFolder();
        break;

    case 'papers':
        openPapers();
        break;

    default:
        app();
        break;
}

function openImageFolder() {
    var command = (process.platform === 'win32') ? 'start' : 'open';
    command += (' ' + paths.IMGS);

    exec(command, function(err,stdout,stderr) {
        if (err){
            console.log("[ERROR] ".red + err);
            console.log("  * Read more guide on ".gray +
                "https://github.com/seokju-na/paper-press.git".underline.gray);
        }
        process.exit(1);
    });
}

function openPapers() {
    var command = (process.platform === 'win32') ? 'start' : 'open';
    command += (' ' + paths.PAPER_FOLDER);

    checkFolders.checkPapersFolder(function(err) {
        if (err) {
            console.log("[ERROR] ".red + err);
            console.log("  * Read more guide on ".gray +
                "https://github.com/seokju-na/paper-press.git".underline.gray);
        }
        else exec(command, function(err,stdout,stderr) {
            if (err){
                console.log("[ERROR] ".red + err);
                console.log("  * Read more guide on ".gray +
                    "https://github.com/seokju-na/paper-press.git".underline.gray);
            }
            process.exit(1);
        });
    });
}

function app() {
    async.waterfall([
        function(callback) {
            console.log("[paper-press] ".green + "Checking papers.");
            checkFolders.checkPapersFolder(function(err) {
                if (err) callback(err);
                else callback(null);
            });
        },

        function(callback) {
            console.log("[paper-press] ".green + "Checking dist files.");
            checkFolders.checkDistFolder(function(err) {
                if (err) callback(err);
                else callback(null);
            });
        },

        function(callback) {
            console.log("[paper-press] ".green + "Check surge login.");
            checkSurgeLogin(function(isLogin) {
                if (!isLogin) callback(errorCodes.SURGE_LOGIN);
                else callback(null);
            });
        },

        function(callback) {
            console.log("[paper-press]".green + " Check blog configure info.");
            makeBlogJSON(function(err) {
                if (err) callback(err);
                else callback(null);
            });
        },

        function(callback) {
            console.log("[paper-press]".green + " Starting server.");
            startServer(callback);
        }
    ], function(err, res) {
        if (err) {
            switch (err) {
                case errorCodes.SURGE_LOGIN:
                    console.log("[ERROR] ".red +
                        "Not currently authenticated on surge.".red);
                    console.log("  * Login on surge. Please login surge - ".gray +
                        "surge login".bold);
                    console.log("  * Did you install surge by global? ".gray +
                        "npm install -g surge".bold);
                    console.log("  * Read more guide on ".gray +
                        "https://github.com/seokju-na/paper-press.git".underline.gray);
                    break;

                case errorCodes.ABORTED:
                    console.log("Aborted.");
                    break;

                default:
                    console.log("[ERROR] ".red + err);
                    console.log("  * Read more guide on ".gray +
                        "https://github.com/seokju-na/paper-press.git".underline.gray);
                    break;
            }

            console.log(" ");
            process.exit(1);
        }
    });
}