'use strict';

angular.module('clientApp')
  .controller('DocumentsCtrl', function ($scope, updateMenuUI) {
  	updateMenuUI.update(3);
  });
