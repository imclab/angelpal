'use strict';

var myApp = angular.module('clientApp');

myApp.controller('ProcessesCtrl', function ($scope, SideMenu, Processes, $rootScope, $location) {
  SideMenu.showMenuLogin();
  SideMenu.updateActive(3);

  	$scope.processes = Processes;

  	$scope.changeView = function (view){
		$rootScope.$apply(function () {
      $location.path(view);
  	});
  }
});

myApp.factory('Processes', function () {
  	return  [
  		{
  			id: 0,
  			name: 'Teaser',
  			date_created: 1000
  		},
  		{
  			id: 1,
  			name: 'Presentation',
  			date_created: 5000
  		},
  		{
  			id: 2,
  			name: 'Product Roadmap',
  			date_created: 10000
  		}
  	];
});

myApp.directive("addnew", function () {
	return {
		restrict: "E",
		scope: {
	        label: '=label'
      	},
		templateUrl: 'views/elements/addNew.html',
		link: function(scope, element) {
			element.click(function () {
				$('.headerAdd', '.headerContent').toggleClass('invisible');
			});
		}
	}
});

myApp.directive("processlink", function () {
	return function(scope, element, attrs, location) {
		element.click(function () {
			scope.changeView('/processes/' + attrs.processlink);
		});
	}
});