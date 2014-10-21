angular.module('rr').directive('details', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		template: '<div class="details" ng-transclude></div>',
		link: function(scope, element, attrs) {
			function handler() {
				$(element).toggleClass('open');
			}

			$('summary', element).click(handler);

			/*if (!$.browser.chrome) {
				var height = $('summary', element).height();

				$(element).css({
					height: height + 'px',
					overflow: 'hidden'
				});

				function handler() {
					if ($(element).prop('open')) {
						$(element).css({
							height: height + 'px'
						});
						$(element).prop('open', false);
					} else {
						$(element).prop('open', true);
						$(element).css({
							height: 'auto'
						});
					}
				}
				$('summary', element).click(handler);
				$('summary', element).on('tap', handler);
			}*/
		}
	};
});