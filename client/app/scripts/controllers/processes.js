'use strict';

angular.module('clientApp')
  .controller('ProcessesCtrl', function ($scope, updateMenuUI) {
  	updateMenuUI.update(2);
  });
