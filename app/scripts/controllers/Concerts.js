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
		'$scope', '$http', '$timeout',

		function($scope, $http, $timeout) {

			$scope.getRandomItems = function(array, count) {
				var randomArray = [];

				while (randomArray.length < count) {
					var number = Math.round(Math.random() * array.length);
					randomArray.push(array[number]);
				}
				return randomArray;

			};

			$scope.scatter = function() {

				$('.photo').each(function(index, item) {
					var angle = (Math.random() * 80) - 40,
						top = ($(window).height() / 7) * index,
						css = {
							top: top,
							left: Math.random() * 100,
							transform: 'rotate(' + angle + 'deg)',
							"-web-transform": 'rotate(' + angle + 'deg)'
						};
					if (index % 2 > 0) {
						css.right = css.left;
						css.left = 'auto';
					}
					$(item).css(css);
				});

			};

			//$scope.photoList = $scope.getRandomItems(photos.feed.entry, 10);
			//$timeout($scope.scatter, 3000);

			$http({
				method: 'GET',
				url: 'http://www.rezatyrakety.cz/data.php',
			}).success(function(data, status, headers, config) {
				$scope.odehraneKoncerty = data.result.oldkoncerts;
				$scope.nearest = data.result.koncerts[0];
				data.result.koncerts.shift();
				$scope.koncerty = data.result.koncerts;
			}).error(function(data, status, headers, config) {
				window.console.error('Loading data error');
			});
		}
	]);