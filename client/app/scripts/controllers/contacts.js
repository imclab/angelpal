'use strict';

var myApp = angular.module('clientApp');

// Angellist constructor function to encapsulate HTTP and pagination logic
myApp.factory('Angellist', function ($http, CacheService, $cookies, $rootScope) {
  var Angellist = function () {
    this.items = [];
    this.busy = false;
    this.page = 1;
    this.done = false;
  };

  Angellist.prototype.getContacts = function () {
    if (this.done ) { return; }

    // use cache
    var contacts = CacheService.get('contacts_page' + this.page);
    if (contacts) {
      this.items = this.items.concat(contacts);
      this.page++;
      return;
    } else if (this.busy) {
      return;
    } 

    this.busy = true;
    var url = "/api/1/users/" + $rootScope.angellist_id + "/followers?page=" + this.page;
    $http.get(url).success(function (data) {
      CacheService.put('contacts_page' + this.page, data.users);
      this.items = this.items.concat(data.users);
      this.busy = false;
      if (this.page >= data.last_page) { 
        this.done = true;
      } else {
        this.page++;
      }
    }.bind(this));
  };

  return Angellist;
});

myApp.controller('ContactsCtrl', function ($scope, $location, $rootScope, Angellist, SideMenu) {
  SideMenu.showMenuLogin();
  SideMenu.updateActive(5);

  $scope.angellist = new Angellist();

	$scope.seeContactDetails = function (id){
      $location.path('contacts/' + id);
  }
});