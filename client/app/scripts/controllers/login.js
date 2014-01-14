'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, SideMenu, $http, $routeParams, $rootScope, $cookies, $location, $window) {
	
	// logout
	if ($routeParams.logout) {
		$rootScope.access_token = undefined;
	}

	// already logged in
	if ($rootScope.access_token != undefined) {
	    $location.path("/feeds");
		return;
	}

	var code = $routeParams.code;
  	if (code) {
  		var url = "http://localhost:3000/login";
  		var postData = {
  			code: code
  		};
  		$http.post(url, postData).success(function (data) {
			$rootScope.access_token = data.access_token;
			if ($rootScope.savedLocation) {
				$location.path($rootScope.savedLocation);
			} else {
		    	$location.path("/feeds");
			}
	    }).error(function(data, status) {
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
