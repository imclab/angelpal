'use strict';

var myApp =angular.module('clientApp');

myApp.controller('FeedsCtrl', function ($scope, SideMenu, $rootScope) {
	SideMenu.updateActive(2);
});
