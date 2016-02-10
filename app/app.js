#! /usr/bin/env node

const async = require('async');
const errorCodes = require('./utils/errorCodes');
const colors = require('colors');

const checkModuleInstalled = require('./utils/checkModuleInstalled');
const checkSurgeLogin = require('./utils/checkSurgeLogin');

var startServer = require('./server/startServer');
var makeBlogJSON = require('./server/makeBlogJSON');

(function() {
    async.waterfall([
        function(callback) {
            console.log("[paper-press] ".green + "Check dependency module's installed.");
            checkModuleInstalled(callback);
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
                case errorCodes.MODULE_INSTALL:
                    console.log("[ERROR] ".red + "Module's are not installed.".red);
                    console.log("  * Reinstall paper-press by global, ".gray +
                        "npm install -g paper-press".bold);
                    console.log("  * Read more guide on ".gray +
                        "https://github.com/seokju-na/paper-press.git".underline.gray);
                    break;

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
            }

            console.log(" ");
            process.exit(1);
        }
    });
})();