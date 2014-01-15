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

myApp.config(function ($routeProvider, $locationProvider, $httpProvider) {

  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

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

myApp.factory('SideMenu', function (UserService) {
  return {
    showMenuLogout: function () {
      $('li', '.nav').addClass('hide');
      $('hr', '.nav').addClass('hide');
      $('.glyphicon', '#menuSettings').removeClass('glyphicon-cog').addClass('glyphicon-info-sign');
      $('.menuLabel', '#menuSettings').html('About');
      $('li:nth-child(1)', '.nav').removeClass('hide');
      $('li:nth-child(7)', '.nav').removeClass('hide');
      $('#loginButton').removeClass('hide');
      this.updateActive(1);
      // $('#loginName').html('').addClass('hide');
    },
    showMenuLogin: function () {
      $('li', '.nav').removeClass('hide');
      $('hr', '.nav').removeClass('hide');
      $('.glyphicon', '#menuSettings').removeClass('glyphicon-info-sign').addClass('glyphicon-cog');
      $('.menuLabel', '#menuSettings').html('Settings');
      $('li:nth-child(1)', '.nav').addClass('hide');
      $('#loginButton').addClass('hide');
      this.updateActive(2);
      // $('#loginName').html('Logged in as ' + UserService.name).removeClass('hide');
    },
    updateActive: function (index) { 
      $('li', '.nav').removeClass('active');
      $('li:nth-child(' + index + ')', '.nav').addClass('active');
    }
  }
});

myApp.factory('AngelPalWrapper', function ($http, CacheService, $rootScope) {
  
  var AngelPalWrapper = function () {
    this.busy = false;
    this.data = [];
    this.page = 1;
  };

  AngelPalWrapper.prototype.getFromCache = function (key) {
    return CacheService.get(key);
  };

  AngelPalWrapper.prototype.getContacts = function () {
    var cacheKey = 'contacts_page_' + this.page;
    var url = "http://localhost:3000/users/" + this.userId + "/followers?page=" + this.page;
    this.get(url, cacheKey);
  };

  AngelPalWrapper.prototype.get = function (url, cacheKey) {
    var cachedData = this.getFromCache(cacheKey);
    if (cachedData) {
      this.items = this.items.concat(cachedData);
      this.page++;
    } else if (!this.busy) {  
      this.busy = true;
      $http.get(url).success(function (data) {
        CacheService.put(cacheKey, data);
        this.items = this.items.concat(data);
        this.busy = false;
        this.page++;
      }.bind(this));
    }
  };

  return AngelPalWrapper;
});

myApp.factory('UserService', [function () {
    var UserService = {
        isLogged: false,
        id: '',
        name: ''
    };

    return UserService;
}]);

myApp.directive('checkUser', function ($rootScope, $location, SideMenu, UserService) {
  return {
    link: function (scope, elem, attrs, ctrl) {
      $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute){
        if (!UserService.isLogged) {
          SideMenu.showMenuLogout();
          if (!prevRoute.isPublic) {
            $location.path('/');
          }
        } else  {
          SideMenu.showMenuLogin();
        }
        /*
        * IMPORTANT:
        * It's not difficult to fool the previous control,
        * so it's really IMPORTANT to repeat the control also in the backend,
        * before sending back from the server reserved information.
        */
      });
    }
  }
});

function login () {
  window.location = "https://angel.co/api/oauth/authorize?client_id=2453f00f021a59cf21f247862645af45&response_type=code";
}
