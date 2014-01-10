'use strict';

angular.module('clientApp')
  .controller('FeedsCtrl', function ($scope, updateMenuUI) {
  	updateMenuUI.update(1);
  });