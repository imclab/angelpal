'use strict';

var myApp = angular.module('clientApp');

myApp.controller('ContactDetailsCtrl', function ($scope, $routeParams, $http, CacheService) {
	
	var contactId = $routeParams.contactId;

	// get contact details
	// use cache
	var contactDetails = CacheService.get('contact_' + contactId);
    if (contactDetails) {
		$scope.contact = contactDetails;
    } else {
    	var url = "api/1/users/" + contactId;
	    $http.get(url).success(function (data) {
			$scope.contact = data;
			CacheService.put('contact_' + contactId, data);
	    }).error(function(data, status) {
		});
    }	

});
