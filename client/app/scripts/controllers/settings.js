'use strict';

angular.module('clientApp')
  .controller('SettingsCtrl', function ($scope, updateMenuUI) {
  	updateMenuUI.update(6);
  });
