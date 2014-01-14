'use strict';

angular.module('clientApp')
  .controller('DocumentsCtrl', function ($scope, SideMenu) {
	SideMenu.updateActive(4);

  	handleClientLoad();
  });
