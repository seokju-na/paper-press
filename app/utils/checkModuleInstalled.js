const errorCodes = require('./errorCodes');

var checkModuleInstalled = function(callback) {
    require('check-dependencies')({
        install: true,
        verbose: false
    }, function(config) {
        if (config['error'].length !== 0) callback(errorCodes.MODULE_INSTALL);
        else callback(null);
    });
};

module.exports = checkModuleInstalled;