'use strict';

var myApp = angular.module('clientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'snap',
  'infinite-scroll',
  'CacheService'
]);

myApp.config(function ($routeProvider, $locationProvider) {
    // removes hash in urls
    $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/feeds', {
      templateUrl: 'views/feeds.html',
      controller: 'FeedsCtrl'
    })
    .when('/processes', {
      templateUrl: 'views/processes.html',
      controller: 'ProcessesCtrl'
    })
    .when('/processes/:processId', {
      templateUrl: 'views/processDetails.html',
      controller: 'ProcessDetailsCtrl'
    })
    .when('/documents', {
      templateUrl: 'views/documents.html',
      controller: 'DocumentsCtrl'
    })
    .when('/contacts', {
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl'
    })
    .when('/contacts/:contactId', {
      templateUrl: 'views/contactDetails.html',
      controller: 'ContactDetailsCtrl'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

});

// init drawer
myApp.config(function (snapRemoteProvider) {
  snapRemoteProvider.globalOptions.disable = 'right';
  snapRemoteProvider.globalOptions.touchToDrag = false;
  snapRemoteProvider.globalOptions.hyperextensible = false;
  snapRemoteProvider.globalOptions.maxPosition = 240;
  snapRemoteProvider.globalOptions.minPosition = -240;

});

myApp.run(function ($rootScope, $resource, snapRemote) {
  snapRemote.getSnapper().then(function (snapper) {
      snapper.on('open', function(){
        $('.snap-drawer').removeClass('hide');
        $('.navbar').addClass('drawerOpened');
      });
      snapper.on('close', function(){
        $('.snap-drawer').addClass('hide');
        $('.navbar').removeClass('drawerOpened');
      });
    });

  // close drawer when link is selected
  $('li', '.nav').click(function () {
    snapRemote.getSnapper().then(function (snapper) {
      snapper.close();
    });
  });
});

$(function() {
    FastClick.attach(document.body);
});

angular.module('CacheService', ['ng'])
    .factory('CacheService', function ($cacheFactory) {
    return $cacheFactory('CacheService');
});



myApp.factory('updateMenuUI', function () {
  return {
    update: function (index) { 
      $('li', '.nav').removeClass('active');
      $('li:nth-child(' + index + ')', '.nav').addClass('active');
    }
  }
});

function login () {
  window.location = "https://angel.co/api/oauth/authorize?client_id=2453f00f021a59cf21f247862645af45&response_type=code";
}

