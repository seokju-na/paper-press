var keyMirror = require('keymirror');

const ErrorCodes = keyMirror({
    READ_BLOG_JSON: null,
    WRITE_BLOG_JSON: null,
    READ_DIR_OF_PAPERS: null,
    WRITE_PAPER: null,
    WRITE_PAPER_HTML: null,
    READ_PAPER_HTML: null,
    GULP_BUILD: null,
    SURGE_DEPLOY: null,
    SURGE_LOGIN: null,
    MODULE_INSTALL: null,
    ABORTED: null,
    UNLINK_PAPER: null
});

module.exports = ErrorCodes;