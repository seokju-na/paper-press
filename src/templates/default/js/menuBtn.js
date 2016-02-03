'use strict';

var isShow = false;
var menuBtnDOM = null;

function toggleBtn() {
    if (menuBtnDOM === null) menuBtnDOM = document.getElementById('menu-btn');

    isShow = !isShow;

    if (isShow) {
        menuBtnDOM.classList.remove('fa-bars');
        menuBtnDOM.classList.add('fa-times');
    }
    else {
        menuBtnDOM.classList.remove('fa-times');
        menuBtnDOM.classList.add('fa-bars');
    }
}

var init = function() {
    document.getElementById('menu').addEventListener('click', function() {
        document.getElementById('menu-target').classList.toggle('show');
        toggleBtn();
    });

    document.getElementById('menu').addEventListener('tap', function() {
        document.getElementById('menu-target').classList.toggle('show');
        toggleBtn();
    });
};

module.exports = init;