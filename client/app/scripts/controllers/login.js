'use strict';

var myApp = angular.module('clientApp');

myApp.controller('LoginCtrl', function ($scope, SideMenu, $http, $routeParams, $rootScope, $cookies, $location, $window, UserService) {

	SideMenu.showMenuLogout();

	if ($routeParams.token) {
		UserService.isLogged = true;
		UserService.token = $routeParams.token;
		$location.path("/feeds");
	}

	
	// logout
	if ($routeParams.logout) {
		UserService.isLogged = false;
		UserService.id = '';
		UserService.name = '';
		// logout from server
		var url = "http://localhost:3000/logout";
		$http.post(url).success(function (data) {
			console.log(data)
		});
		return;
	}

	// // already logged in
	// if (UserService.isLogged) {
	//     $location.path("/feeds");
	// 	return;
	// }

	// // check if logged in on the server
	// var url = "http://localhost:3000/me";
	// $http.get(url).success(function (data) {
	// 	if (data.id) {
	// 		UserService.isLogged = true;
	// 		UserService.id = data.id;
	// 		UserService.angellist_id = data.angellist_id;
	// 		UserService.name = data.name;
	// 		if ($rootScope.savedLocation) {
	// 			$location.path($rootScope.savedLocation);
	// 		} else {
	// 			$location.path("/feeds");
	// 		}
	// 	} else {
	// 		// UserService.logout();
	// 	}
	// }).error(function (data, status) {
	// 	// UserService.logout();
	// });

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
