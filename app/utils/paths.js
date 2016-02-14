module.exports = {
    CLIENT: __dirname + '/../client/dist',
    IMGS: __dirname + '/../../src/assets/imgs',
    SRC: __dirname + '/../../src/',
    BLOG_JSON: __dirname + '/../../src/blog.config.json',
    PAPER_FOLDER: __dirname + '/../../src/papers',
    PAPERS: __dirname + '/../../src/papers/',
    TEMPLATES: __dirname + '/../../src/templates/',
    DIST: __dirname + '/../../dist/',
    DIST_FOLDER: __dirname + '/../../dist',

    GULP: 'gulp --gulpfile ' + __dirname + '/../../gulpfile.js',
    SURGE: 'surge',
    SURGE_LOCAL: __dirname + '/../../node_modules/.bin/surge'
};