'use strict';

var myApp = angular.module('clientApp');

myApp.directive("contactlink", function () {
	return function(scope, element, attrs, location) {
		element.click(function () {
			scope.changeView('contacts/' + attrs.contactlink);
		});
	}
});

// Angellist constructor function to encapsulate HTTP and pagination logic
myApp.factory('Angellist', function ($http, CacheService) {
  var Angellist = function (userId) {
    this.userId = userId;
    this.items = [];
    this.busy = false;
    this.page = 1;
  };

  Angellist.prototype.getContacts = function () {

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

    var url = "http://localhost:3000/users/" + this.userId + "/followers?page=" + this.page;
    $http.get(url).success(function (data) {
      CacheService.put('contacts_page' + this.page, data.users);
      this.items = this.items.concat(data.users);
      this.page++;
      this.busy = false;
    }.bind(this));
  };

  return Angellist;
});

myApp.controller('ContactsCtrl', function ($scope, $location, $rootScope, Angellist, SideMenu) {
  SideMenu.showMenuLogin();
  SideMenu.updateActive(5);

	$scope.angellist = new Angellist(671);

	$scope.changeView = function (view){
		$rootScope.$apply(function () {
      $location.path(view);
  	});
  }
});