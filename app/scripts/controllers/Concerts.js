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

			/*$scope.scatter = function() {

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

			};*/

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
						window.console.error('Loading data error');
						$scope.loading = true;
						$scope.opened = false;
					});

				} else {
					$scope.opened = !$scope.opened;
				}
			};

			$scope.loadPhotos = function(data) {
				console.log(data);

				var photos = $scope.getRandomItems(data.feed.entry, 20);

				var imgMarkup = '<div class="photo loading"><img><i></i><span></span></div>';

				$('article:not(article:first-child)>div')
					.append(imgMarkup)
					.prepend(imgMarkup);

				$('.photo').each(function(index, photo) {
					try {
						var item = photos[index],
							date;

						$('img', photo).load(function() {
							
							$(this).parent('.photo').removeClass('loading')
						}).attr('src', item['media$group']['media$thumbnail'][0].url);
						$('i', photo).html(item['summary']['$t']);

						date = new Date(parseInt(item['exif$tags']['exif$time']['$t'], 10));
						$('span', photo).html(date.getDay() + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear());
					} catch (e) {
						console.error('Unable to render item ' + index + ': ', item);
					}
				});
			}

			$('body').append('<script src="http://picasaweb.google.com/data/feed/api/user/juhyxx/albumid/5252817473210531713?kind=photo&alt=json-in-script&thumbsize=243c,354&callback=setData&fields=entry(summary,exif:tags, media:group/media:thumbnail)"><\/script>');

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

		}
	]);