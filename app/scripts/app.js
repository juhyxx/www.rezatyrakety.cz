'use strict';

/**
 * @ngdoc overview
 * @name rr
 * @description
 * # rr
 *
 * Main module of the application.
 */
angular
	.module('rr', [
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
	])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'Concerts'
			})
			.when('/texty', {
				templateUrl: 'views/texty.html',
			})
			.when('/nahravky', {
				templateUrl: 'views/nahravky.html',
			})
			.when('/vorr', {
				templateUrl: 'views/vorr.html',
			})
			.when('/trojka', {
				templateUrl: 'views/trojka.html',
			})
			.otherwise({
				redirectTo: '/'
			});
	});