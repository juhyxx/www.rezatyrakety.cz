'use strict';

/**
 * @ngdoc function
 * @name rr.controller:Concerts
 * @description
 * # Concerts
 * Controller of the rr
 */
angular.module('rr')
	.controller('Concerts', [
		'$scope', '$http', '$rootScope',
		
		function($scope, $http, $rootScope) {
			$http({
				method: 'GET',
				url: 'data.json'
			}).success(function(data, status, headers, config) {
				$rootScope.koncerty = data.result.koncerts;
				$scope.odehraneKoncerty = data.result.oldkoncerts;
			}).error(function(data, status, headers, config) {
				window.console.error('Loading data error');
			});
		}
	]);