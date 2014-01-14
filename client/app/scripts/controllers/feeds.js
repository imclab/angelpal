'use strict';

var myApp =angular.module('clientApp');

myApp.controller('FeedsCtrl', function ($scope, SideMenu) {
	SideMenu.updateActive(2);
});
