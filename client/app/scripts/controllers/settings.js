'use strict';

angular.module('clientApp')
  .controller('SettingsCtrl', function ($scope, SideMenu) {
  SideMenu.updateActive(7);

  	$('#deleteAccountButton').click(function () {
  		$('#deleteAccountModal').appendTo("body").modal('show');
  	});
  	$('#deleteAccountConfirm').click(function () {
  		$('#deleteAccountModal').modal('hide');
  		console.log("TODO : call logout + delete account on server");
  	});

  });
