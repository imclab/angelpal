'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, updateMenuUI, $http, $routeParams, $rootScope, $cookies, $location) {
	// logout
	if ($routeParams.logout) {
		$cookies.access_token = undefined;
	}

	if ($cookies.access_token != undefined) {
	    $location.path("/feeds");
		return;
	}

  	updateMenuUI.update(0);

	var code = $routeParams.code;
  	if (code) {
  		var url = "loginproxy/oauth/token?client_id=2453f00f021a59cf21f247862645af45&client_secret=e72b18b0210117916f987655212f5e5f&code=" + code + "&grant_type=authorization_code";
  		$http.post(url).success(function (data) {
			$cookies.access_token = data.access_token;
		    $location.path("/feeds");
	    }).error(function(data, status) {
			$cookies.access_token = undefined;
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
