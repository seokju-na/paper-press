var exec = require('child_process').exec;

const paths = require('./paths');
const notAuthenticated = 'Not currently authenticated';

var checkSurgeLogin = function(callback) {
    exec(paths.SURGE + ' whoami', function(err, stdout, stderr) {
        if (stdout.search(notAuthenticated) !== -1) callback(false);
        else callback(true);
    });
};

module.exports = checkSurgeLogin;
