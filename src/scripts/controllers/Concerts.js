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

			$scope.opened = false;

			$scope.loadConcerts = function() {
				if (!$scope.odehraneKoncerty) {
					$scope.loading = true;
					$http({
						method: 'GET',
						url: 'http://www.rezatyrakety.cz/data/done.php',
					}).success(function(data) {
						$scope.odehraneKoncerty = data.result;
						$scope.loading = false;
						$scope.opened = true;
					}).error(function() {
						window.console.error('Loading concert data error');
						$scope.loading = true;
						$scope.opened = false;
					});

				} else {
					$scope.opened = !$scope.opened;
				}
			};

			$scope.renderPhotos = function(data) {
				$scope.photos = $scope.photos || data.feed.entry;

				var imgMarkup = '<div class="photo loading"><img><i></i><span></span></div>';

				$('article:not(article:first-child)>div')
					.append(imgMarkup)
					.prepend(imgMarkup);

				$('.photo').each(function(index, photo) {
					var rnd = Math.round(Math.random() * $scope.photos.length),
						item = $scope.photos[rnd];

					setTimeout(function() {
						$('img', photo).load(function() {
							var parent = $(this).parent('.photo');
							parent.removeClass('loading');
							setTimeout(function() {
								var rnd = Math.round(Math.random() * $scope.photos.length);
								parent.addClass('loading');
								setTimeout(function() {
									$scope.renderPhoto(photo, $scope.photos[rnd]);
								}, 3000);
							}, 10000);
						});

						$scope.renderPhoto(photo, item);
					}, index * 3000);
				});
			};

			$scope.renderPhoto = function(photo, item) {
				try {
					var date = new Date(parseInt(item['gphoto$timestamp']['$t'], 10));

					$(photo).addClass('loading');
					$('img', photo).attr('src', item['media$group']['media$thumbnail'][0].url);
					$('i', photo).html(item['summary']['$t']);
					$('span', photo).html((date.getDay() + 1) + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear());
				} catch (e) {
					console.error('Unable to render item : ', item, e);
				}
			};

			$('header, article').css({
				'min-height': window.innerHeight
			});
			$(window).resize(function() {
				$('header, article').css({
					'min-height': window.innerHeight
				});
			});

			$http({
				method: 'GET',
				url: 'http://www.rezatyrakety.cz/data/current.php',
			}).success(function(data) {
				$scope.nearest = data.result.koncerts[0];
				data.result.koncerts.shift();
				$scope.koncerty = data.result.koncerts;

				$scope.oldkoncertsCount = data.result['oldkoncerts-count'] - 2;
			}).error(function() {
				window.console.error('Loading data error');
			});

			setTimeout(function() {
				$('body').append('<script src="http://picasaweb.google.com/data/feed/api/user/juhyxx/albumid/5252817473210531713?kind=photo&alt=json-in-script&thumbsize=243c&callback=setData&fields=entry(summary,gphoto:timestamp , media:group/media:thumbnail)"><\/script>');
			}, 100);

		}
	]);