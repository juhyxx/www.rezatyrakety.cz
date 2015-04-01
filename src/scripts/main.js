$(function () {

	$('header, article').css({
		'min-height': window.innerHeight
	});

	$(window).resize(function () {
		$('header, article').css({
			'min-height': window.innerHeight
		});
	});
});