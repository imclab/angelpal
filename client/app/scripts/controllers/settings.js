'use strict';

var myApp = angular.module('clientApp');

myApp.controller('SettingsCtrl', function ($scope, SideMenu, UserService, $cookies, $http) {

  var url = "http://localhost:3000/me";
  $http.get(url).success(function (data) {
    if (data.id) {
      UserService.isLogged = true;
      UserService.id = data.id;
      UserService.angellist_id = data.angellist_id;
      UserService.name = data.name;

      $scope.isLogged = UserService.isLogged;

      SideMenu.showMenuLogin();

      $('#deleteAccountButton').click(function () {
        $('#deleteAccountModal').appendTo("body").modal('show');
      });

      $('#deleteAccountConfirm').click(function () {
        $('#deleteAccountModal').modal('hide');
        console.log("TODO : call logout + delete account on server");
      });

    } else {
        SideMenu.showMenuLogout();
    }

    SideMenu.updateActive(7);

  });

  SideMenu.updateActive(7);

});
