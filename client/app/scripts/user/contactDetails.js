'use strict';

var myApp = angular.module('clientApp');

myApp.controller('ContactDetailsCtrl', function ($scope, $routeParams, $http, CacheService, SideMenu, $cookies) {
	SideMenu.showMenuLogin();
  	SideMenu.updateActive(5);

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

    $scope.showInviteDialog = function () {
    	var url = myApp.baseUrl + "organizationsAdmin";
	    $http.get(url).success(function (organizations) {
	    	$scope.organizations = organizations;
	    }.bind(this));
		$('#inviteModal').appendTo("body").modal('show');
	};


	$('#inviteConfirm').click(function () {
		if ($('select', '#inviteModal').val() >= 0) {
			$('.loadingRequest', '#inviteModal').removeClass('hide');
		  	$http.defaults.headers.common.Authorization = $cookies.angelpal_token;
			var url = myApp.baseUrl + "organizations/" + $('select', '#inviteModal').val() + '/users/' + contactId;
		    $http.post(url, {role: $('#makeAdmin', '#inviteModal').is(':checked') ? 10 : 0})
		    .success(function (data) {
		    	$('.loadingRequest', '#inviteModal').addClass('hide');
				$('#inviteModal').modal('hide');
		    }).error(function(data, status) {
		    	$('.loadingRequest', '#inviteModal').addClass('hide');
		    	$('#inviteModal').modal('hide');
			});
		}
	});

});
