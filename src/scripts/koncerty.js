$(function () {

	var templateKoncerty = $('#template-koncerty').html(),
		templateKoncertyNejblizsi = $('#template-koncerty-nearest').html();

	Mustache.parse(templateKoncerty);
	Mustache.parse(templateKoncertyNejblizsi);

	function addFormaters(data) {
		$.extend(data, {
			dateFormat: function () {
				return function (text, render) {
					var date = new Date(render(text) * 1000);
					return date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();

				};
			},
			timeFormat: function () {
				return function (text, render) {
					var date = new Date(render(text) * 1000);
					return date.getHours() + '. ' + ('0' + date.getMinutes()).slice(-2);

				};
			},
			isTrojka: function () {
				return function (text, render) {
					return render(text) == 1 ? 'trojka' : '';
				};
			}
		});
		return data;
	}

	$.ajax({
		method: 'GET',
		url: 'http://www.rezatyrakety.cz/data/current.php',

		success: function (data) {
			$('#odehrane').html($('#odehrane').html().replace('{{oldkoncertsCount}}', data.result['oldkoncerts-count']));
			$('#koncerty-list').html(Mustache.render(templateKoncerty, addFormaters(data.result)));
			$('#koncerty-nejblizsi-list').html(Mustache.render(templateKoncertyNejblizsi, addFormaters({
				koncerts: data.result.koncerts[0]
			})));
		}
	});

	$('details.old').click(function () {
		if ($('#koncerty-list-odehrane ul li').length === 0) {
			$.ajax({
				method: 'GET',
				url: 'http://www.rezatyrakety.cz/data/done.php',
				success: function (data) {
					$('#koncerty-list-odehrane').html(Mustache.render(templateKoncerty, addFormaters({
						koncerts: data.result
					})));
				}
			});
		}
	});
});