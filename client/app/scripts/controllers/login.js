'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, SideMenu, $http, $routeParams, $rootScope, $cookies, $location, $window, UserService) {

	SideMenu.showMenuLogout();

	// authentification callback
	if ($routeParams.token != undefined) {
		$cookies.angelpal_token = $routeParams.token;
		$location.search('token', null);
		$location.path("/feeds");
		return;
	}

	// logout
	if ($routeParams.logout) {
		$cookies.angelpal_token = '';
		$location.search('logout', null);
		UserService.logout();
		return;
	}

	// if already logged in
	if ($cookies.angelpal_token != '') { // Might be logged in
		$location.path("/feeds");
	}

});

myApp.directive("backbutton", function () {
	return {
		restrict: "E",
		template: '<button class="backButton btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span> Back</button>',
		link: function(scope, element) {
			element.click(function () {
				window.history.back();
			});
		}
	}
});

myApp.directive("loadinglayout", function () {
	return {
		restrict: "E",
		scope: {
	        label: '=label'
      	},
		template: '<div class="loadingLayout alert alert-info"><i>{{label}}...</i></div>'
	}
});
