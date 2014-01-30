'use strict';

var myApp = angular.module('clientApp');

myApp.controller('ProcessDetailsCtrl', function ($scope, $routeParams, $http, CacheService, SideMenu) {
  SideMenu.showMenuLogin();
  SideMenu.updateActive(3);

  var processId = $routeParams.processId;

  // get process details
  // use cache
  // var contactDetails = CacheService.get('contact_' + contactId);
  //   if (contactDetails) {
  //   $scope.contact = contactDetails;
  //   } else {
  //     var url = "api/1/users/" + contactId;
  //     $http.get(url).success(function (data) {
  //     $scope.contact = data;
  //     CacheService.put('contact_' + contactId, data);
  //     }).error(function(data, status) {
  //   });
  //   } 

});
