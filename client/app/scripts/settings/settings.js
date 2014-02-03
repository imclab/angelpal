'use strict';

var myApp = angular.module('clientApp');

myApp.controller('SettingsCtrl', function ($scope, SideMenu, UserService, $cookies, $http) {

  if (UserService.user != null) {
      $scope.isLogged = true;
      SideMenu.showMenuLogin();

      $('#deleteAccountButton').click(function () {
        $('#deleteAccountModal').appendTo("body").modal('show');
      });

      $('#deleteAccountConfirm').click(function () {
        $('#deleteAccountModal').modal('hide');
        console.log("TODO : call logout + delete account on server");
      });

  } else {
      $scope.isLogged = false;
      SideMenu.showMenuLogout();
  }

  SideMenu.updateActive(7);

});
