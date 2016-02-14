var _ = require('underscore');

var paperListDOM = null;
var paperDOMs = null;
var paperTags = null;
var tagSelectors = null;

function getPaperTags() {
    for (var idx=0, len=paperDOMs.length; idx<len; idx++)
        paperTags[idx] = paperDOMs[idx].getAttribute('tags').split(' ');
}

function _filterPapers(tagName) {
    if (tagName === null) {
        for (var idx=0, len=paperTags.length; idx<len; idx++) {
            if (paperDOMs[idx].classList.contains('filter'))
                paperDOMs[idx].classList.remove('filter');
        }
        return;
    }

    for (var idx=0, len=paperTags.length; idx<len; idx++) {
        var targetPaperTags = paperTags[idx];

        if (!_.contains(targetPaperTags, tagName)) {
            if (!paperDOMs[idx].classList.contains('filter'))
                paperDOMs[idx].classList.add('filter');
        }
        else {
            if (paperDOMs[idx].classList.contains('filter'))
                paperDOMs[idx].classList.remove('filter');
        }
    }
}

function _selectedPaper(tagName) {
    _.forEach(tagSelectors, function(elem) {
        if (elem.classList.contains('selected'))
            elem.classList.remove('selected');

        if (elem.getAttribute('tag') === tagName)
            elem.classList.add('selected');
    });
}


function listenHashChanged() {
    window.addEventListener('hashchange', function() {
        var tagName = location.hash.slice(1, location.hash.length);
        tagName = decodeURI(tagName);

        if (tagName === '') tagName = null;

        _filterPapers(tagName);
        _selectedPaper(tagName);
    });
}



var init = function(initHash) {
    paperListDOM = document.getElementById('paper-list');
    paperDOMs = paperListDOM.children;
    paperTags = [];
    tagSelectors = document.getElementsByClassName('tag-selector');

    getPaperTags();
    listenHashChanged();

    if (initHash !== null) {
        _filterPapers(initHash);
        _selectedPaper(initHash);
    }
};

module.exports = init;