'use strict';

var myApp = angular.module('clientApp');

myApp.controller('OrganizationDetailsCtrl', function ($scope, $routeParams, $http, CacheService, SideMenu, $location, UserService) {
	SideMenu.showMenuLogin();
  	SideMenu.updateActive(4);

	var organizationId = $routeParams.organizationId;

	var url = "http://localhost:3000/organizations/";
    $http.get(url + organizationId).success(function (organization) {
    	$scope.organization = organization;
    }.bind(this));

	$scope.showDeleteDialog = function () {
		$('#deleteModal').appendTo("body").modal('show');
	};

	$scope.seeContactDetails = function (id) {
		$location.path('/contacts/' + id);
	};

	$scope.leaveOrganization = function () {
		$('#deleteModal').modal('hide');
    	var url = "http://localhost:3000/organizations/" + organizationId + "/users/" + UserService.user.id + "/leave";
		$http.post(url)
	    .success(function (data) {
			$location.path('/organizations');
	    }).error(function(data, status) {
	    	$location.path('/organizations');
		});		
	};

	$scope.showInviteContactDialog = function () {

	};

});

myApp.filter('iif', function () {
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
});