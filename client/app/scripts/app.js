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

myApp.baseUrl = "http://localhost:3000/";

myApp.config(function ($routeProvider, $locationProvider, $httpProvider) {

  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/feeds', {
      templateUrl: 'views/feeds.html',
      controller: 'FeedsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/processes', {
      templateUrl: 'views/processes.html',
      controller: 'ProcessesCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/processes/:processId', {
      templateUrl: 'views/processDetails.html',
      controller: 'ProcessDetailsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/organizations', {
      templateUrl: 'views/organizations.html',
      controller: 'OrganizationsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/organizations/:organizationId', {
      templateUrl: 'views/organizationDetails.html',
      controller: 'OrganizationDetailsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/contacts', {
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/contacts/:contactId', {
      templateUrl: 'views/contactDetails.html',
      controller: 'ContactDetailsCtrl',
      resolve: { loggedin: checkLoggedin }
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

    $httpProvider.responseInterceptors.push(function ($q, $location, $cookies) {
      return function (promise) {
        return promise.then(
          // Success: just return the response
          function (response) {
            return response;
          }, // Error: check the error status to get only the 401
          function (response) {
            if (response.status === 401) {
              $cookies.angelpal_token = '';
              $location.url('/');
            }
            return $q.reject(response);
          } 
        ); 
      } 
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
      $('.glyphicon', '#menuSettings').removeClass('glyphicon-cog').addClass('glyphicon-info-sign');
      $('.menuLabel', '#menuSettings').html('About');
      $('li:nth-child(1)', '.nav').removeClass('hide');
      $('li:nth-child(7)', '.nav').removeClass('hide');
      $('#loginButton').removeClass('hide');
      this.updateActive(1);
    },
    showMenuLogin: function () {
      $('li', '.nav').removeClass('hide');
      $('hr', '.nav').removeClass('hide');
      $('.glyphicon', '#menuSettings').removeClass('glyphicon-info-sign').addClass('glyphicon-cog');
      $('.menuLabel', '#menuSettings').html('Settings');
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
    var url = myApp.baseUrl + "users/" + this.userId + "/followers?page=" + this.page;
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

myApp.factory('UserService', function ($cookies) {
    var UserService = {
        user: null
    };

    UserService.logout = function () {
      UserService.user = null;
    };

    UserService.login = function (user) {
      UserService.user = user;
    };

    return UserService;
});

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, UserService, $cookies) {
  // Initialize a new promise v
  var deferred = $q.defer();

  $http.defaults.headers.common.Authorization = $cookies.angelpal_token;

  // Make an AJAX call to check if the user is logged in
  $http.get(myApp.baseUrl + 'me')
  .success(function (user) { // Authenticated
    UserService.login(user);
    $rootScope.angellist_id = user.angellist_id;
    $timeout(deferred.resolve, 0); 
  }).error(function (error) {
    UserService.logout();
    $timeout(function(){deferred.reject();}, 0);
  });
};
