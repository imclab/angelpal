'use strict';

angular.module('clientApp')
  .controller('SettingsCtrl', function ($scope, updateMenuUI) {
  	updateMenuUI.update(6);

  	$('#deleteAccountButton').click(function () {
  		$('#deleteAccountModal').appendTo("body").modal('show');
  	});
  	$('#deleteAccountConfirm').click(function () {
  		$('#deleteAccountModal').modal('hide');
  		console.log("TODO : call logout + delete account on server");
  	});

  });
