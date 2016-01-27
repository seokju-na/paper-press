var blogInfo = require('../../src/blog.json');

module.exports = function(renderedMarkdown) {
    var html =
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<title>' + blogInfo.title + '</title>' +
        '<link rel="apple-touch-icon" sizes="57x57" href="../assets/favicon/apple-icon-57x57.png">' +
        '<link rel="apple-touch-icon" sizes="60x60" href="../assets/favicon/apple-icon-60x60.png">' +
        '<link rel="apple-touch-icon" sizes="72x72" href="../assets/favicon/apple-icon-72x72.png">' +
        '<link rel="apple-touch-icon" sizes="76x76" href="../assets/favicon/apple-icon-76x76.png">' +
        '<link rel="apple-touch-icon" sizes="114x114" href="../assets/favicon/apple-icon-114x114.png">' +
        '<link rel="apple-touch-icon" sizes="120x120" href="../assets/favicon/apple-icon-120x120.png">' +
        '<link rel="apple-touch-icon" sizes="144x144" href="../assets/favicon/apple-icon-144x144.png">' +
        '<link rel="apple-touch-icon" sizes="152x152" href="../assets/favicon/apple-icon-152x152.png">' +
        '<link rel="apple-touch-icon" sizes="180x180" href="../assets/favicon/apple-icon-180x180.png">' +
        '<link rel="icon" type="image/png" sizes="192x192"  href="../assets/favicon/android-icon-192x192.png">' +
        '<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon/favicon-32x32.png">' +
        '<link rel="icon" type="image/png" sizes="96x96" href="../assets/favicon/favicon-96x96.png">' +
        '<link rel="icon" type="image/png" sizes="16x16" href="../assets/favicon/favicon/favicon-16x16.png">' +
        '<link rel="stylesheet" href="../assets/fonts/metro/metro-icons.css" />' +
        '<link rel="stylesheet" href="../css/main.css" />' +
        '</head>' +
        '<body>' +
        renderedMarkdown +
        '<script src="../js/main.js"></script>' +
        '</body>' +
        '</html>';


};