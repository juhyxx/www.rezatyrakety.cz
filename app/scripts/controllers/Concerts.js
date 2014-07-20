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
		'$scope', '$http',

		function($scope, $http) {

			$http({
				method: 'GET',
				url: 'data.json'
			}).success(function(data, status, headers, config) {
				$scope.koncerty = data.result.koncerts;
				$scope.odehraneKoncerty = data.result.oldkoncerts;
				$scope.nearest = $scope.koncerty[0];
			}).error(function(data, status, headers, config) {
				window.console.error('Loading data error');
			});
		}
	]);