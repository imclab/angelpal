'use strict';

angular.module('clientApp')
  .controller('OrganizationsCtrl', function ($scope, SideMenu, $http) {
  	SideMenu.showMenuLogin();
	SideMenu.updateActive(4);

	var url = "http://localhost:3000/organizations";
    $http.get(url).success(function (data) {
    	console.log(data)
    }.bind(this));


  });
