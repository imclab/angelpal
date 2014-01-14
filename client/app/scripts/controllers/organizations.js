'use strict';

angular.module('clientApp')
  .controller('OrganizationsCtrl', function ($scope, SideMenu) {
	SideMenu.updateActive(4);

  });
