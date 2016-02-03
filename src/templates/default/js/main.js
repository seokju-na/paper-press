'use strict';

var menuBtn = require('./menuBtn');
var paperList = require('./paperList');

function app(pathname) {
    switch(pathname) {
        case '/':
            var initHash;

            if (location.hash === '#' || location.hash === '') initHash = null;
            else initHash = location.hash.slice(1, location.hash.length);

            console.log("initHash", initHash);

            menuBtn();
            paperList(initHash);
            break;

        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    app(location.pathname);
});

