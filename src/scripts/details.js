$(function () {
	if ($('details')[0].open === undefined) {
		document.documentElement.className += ' no-details';
		$('details').click(function () {
			var detail = $(this);

			if (detail.attr('open')) {
				detail.removeAttr('open');
			} else {
				detail.attr('open', 'open');
			}
		});
	}
});