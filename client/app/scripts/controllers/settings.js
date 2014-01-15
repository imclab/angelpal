'use strict';

var myApp = angular.module('clientApp');

myApp.controller('SettingsCtrl', function ($scope, SideMenu, UserService, $cookies) {
	if ($cookies.access_token != undefined) {
		// get request to server
		UserService.isLogged = true;
	}

  $scope.isLogged = UserService.isLogged;

  if (UserService.isLogged) {
  	SideMenu.showMenuLogin();
  } else {
  	SideMenu.showMenuLogout();
  }
  SideMenu.updateActive(7);

  $('#deleteAccountButton').click(function () {
  	$('#deleteAccountModal').appendTo("body").modal('show');
  });

  $('#deleteAccountConfirm').click(function () {
  	$('#deleteAccountModal').modal('hide');
  	console.log("TODO : call logout + delete account on server");
  });

});
