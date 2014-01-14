'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, SideMenu, $http, $routeParams, $rootScope, $cookies, $location) {
	
	// logout
	if ($routeParams.logout) {
		$rootScope.isLoggedIn = false;
		$rootScope.access_token = undefined;
	}

	// already login
	if ($rootScope.access_token != undefined) {
		$rootScope.isLoggedIn = true;
	    $location.path("/feeds");
		return;
	}

	SideMenu.showMenuLogout();
	$('#loginToggle').click(function () {
		$('#loginForm').toggleClass('hidden-xs');
	});

	var code = $routeParams.code;
  	if (code) {
  		var url = "loginproxy/oauth/token?client_id=2453f00f021a59cf21f247862645af45&client_secret=e72b18b0210117916f987655212f5e5f&code=" + code + "&grant_type=authorization_code";
  		$http.post(url).success(function (data) {
			$rootScope.access_token = data.access_token;
			$rootScope.isLoggedIn = true;
		    $location.path("/feeds");
	    }).error(function(data, status) {
	    	$rootScope.isLoggedIn = false;
			$rootScope.access_token = undefined;
		});
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
