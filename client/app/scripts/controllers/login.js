'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, SideMenu, $http, $routeParams, $rootScope, $cookies, $location, $window, UserService) {

	SideMenu.showMenuLogout();
	
	// logout
	if ($routeParams.logout) {
		UserService.isLogged = false;
		UserService.id = '';
		UserService.name = '';
		$cookies.access_token = undefined;
	}

	if ($cookies.access_token != undefined) {
		// get request to server
		UserService.isLogged = true;
	}

	// already logged in
	if (UserService.isLogged) {
	    $location.path("/feeds");
		return;
	}

	var code = $routeParams.code;
	$scope.code = code;
  	if (code) {
  		var url = "http://localhost:3000/login";
  		var postData = {
  			code: code
  		};
  		$http.post(url, postData).success(function (data) {
			UserService.isLogged = true;
			UserService.id = data.angellist_id;
			UserService.name = data.name;
			$cookies.access_token = 'boboby';
			if ($rootScope.savedLocation) {
				$location.path($rootScope.savedLocation);
			} else {
		    	$location.path("/feeds");
			}
	    }).error(function(data, status) {
			UserService.logout();
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
