'use strict';

angular.module('clientApp')
  .controller('OrganizationsCtrl', function ($scope, SideMenu, $http, $location) {
  	SideMenu.showMenuLogin();
	SideMenu.updateActive(4);

	var url = "http://localhost:3000/organizations";
    $http.get(url).success(function (organizations) {
    	$scope.dataLoaded = true;
    	$scope.organizations = organizations;
    }.bind(this));

    $scope.addNewOrganization = function () {
    	var newOrganizationName = $('input', '#addNewOrga').val();
    	$('input', '#addNewOrga').val('');
    	if (newOrganizationName != '') {
    		$http.post(url, {name: newOrganizationName}).success(function () {
    			$http.get(url).success(function (organizations) {
			    	$scope.dataLoaded = true;
			    	$scope.organizations = organizations;
			    }.bind(this));
	    	}.bind(this));
    	}   	
    }

    $scope.seeOrganizationDetails = function (id) {
    	$location.path('/organizations/' + id);
    }


  });
