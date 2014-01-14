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

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      isPublic: true
    })
    .when('/feeds', {
      templateUrl: 'views/feeds.html',
      controller: 'FeedsCtrl',
      isPublic: false
    })
    .when('/processes', {
      templateUrl: 'views/processes.html',
      controller: 'ProcessesCtrl',
      isPublic: false
    })
    .when('/processes/:processId', {
      templateUrl: 'views/processDetails.html',
      controller: 'ProcessDetailsCtrl',
      isPublic: false
    })
    .when('/organizations', {
      templateUrl: 'views/organizations.html',
      controller: 'OrganizationsCtrl',
      isPublic: false
    })
    .when('/contacts', {
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl',
      isPublic: false
    })
    .when('/contacts/:contactId', {
      templateUrl: 'views/contactDetails.html',
      controller: 'ContactDetailsCtrl',
      isPublic: false
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl',
      isPublic: true
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

myApp.factory('SideMenu', function () {
  return {
    showMenuLogout: function () {
      $('li', '.nav').addClass('hide');
      $('hr', '.nav').addClass('hide');
      $('.glyphicon', '#settingsMenu').toggleClass('glyphicon-cog glyphicon-info-sign');
      $('.menuLabel', '#settingsMenu').html('About');
      $('li:nth-child(1)', '.nav').removeClass('hide');
      $('li:nth-child(7)', '.nav').removeClass('hide');
      $('#loginButton').removeClass('hide');
      this.updateActive(1);
    },
    showMenuLogin: function () {
      $('li', '.nav').removeClass('hide');
      $('hr', '.nav').removeClass('hide');
      $('.glyphicon', '#settingsMenu').toggleClass('glyphicon-cog glyphicon-info-sign');
      $('.menuLabel', '#settingsMenu').html('Settings');
      $('li:nth-child(1)', '.nav').addClass('hide');
      $('#loginButton').addClass('hide');
      this.updateActive(2);
    },
    updateActive: function (index) { 
      $('li', '.nav').removeClass('active');
      $('li:nth-child(' + index + ')', '.nav').addClass('active');
    }
  }
});

myApp.run(function ($rootScope, $location, SideMenu) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
        var userAuthenticated = !($rootScope.access_token == undefined); /* Check if the user is logged in */
        if (!userAuthenticated) {
          SideMenu.showMenuLogout();
        } else {
            SideMenu.showMenuLogin();
        }
        if (!userAuthenticated && !next.isPublic) {
            /* You can save the user's location to take him back to the same page after he has logged-in */
            $rootScope.savedLocation = $location.url();
            $location.path('/');
        }
    });
  });

function login () {
  window.location = "https://angel.co/api/oauth/authorize?client_id=2453f00f021a59cf21f247862645af45&response_type=code";
}

