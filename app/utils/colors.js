var randomColor = require('randomcolor');

const colors = function(count) {
    return randomColor({
        count: count,
        luminosity: 'bright',
        hue: 'random'
    });
};

module.exports = colors;