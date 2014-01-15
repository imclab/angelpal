'use strict';

angular.module('clientApp')
  .controller('OrganizationsCtrl', function ($scope, SideMenu) {
  	SideMenu.showMenuLogin();
	SideMenu.updateActive(4);

  });
