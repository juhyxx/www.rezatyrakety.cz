document.addEventListener('DOMContentLoaded', function() {

	var months = [
			'leden',
			'únor',
			'březen',
			'duben',
			'květen',
			'červen',
			'červenec',
			'srpen',
			'září',
			'říjen',
			'listopad',
			'prosinec'
		],
		days = [
			'pondělí',
			'úterý',
			'středa',
			'čtvrtek',
			'pátek',
			'sobota',
			'neděle'
		];


	function addFormaters(data) {
		$.extend(data, {
			dateFormat: function() {
				return function(text, render) {
					var date = moment(render(text) * 1000);

					return '<i>' + date.format('dddd') + '</i> ' + date.format('D. MMMM YYYY') + ' <i>' + date.format('H:mm') + '</i>';
				};
			},
			isTrojka: function() {
				return function(text, render) {
					return render(text) == 1 ? 'trojka' : '';
				};
			}
		});
		return data;
	}
	

	var templateKoncerty = $('#template-koncerty').html();
	Mustache.parse(templateKoncerty);
	var templatePhotos = $('#template-photos').html();
	Mustache.parse(templatePhotos);


	$('.old-link').click(function() {
		if ($(this).hasClass('open')) {
			$('#koncerty-list-odehrane').html('');
		} else {
			$.ajax({
				method: 'GET',
				url: 'http://www.rezatyrakety.cz/data/done.php',
				success: function(data) {
					$('#koncerty-list-odehrane').html(Mustache.render(templateKoncerty, addFormaters({
						koncerts: data.result
					})));
				}
			});
		}
		$('.old-link').toggleClass('open');
	});

	$.ajax({
		method: 'GET',
		url: 'http://www.rezatyrakety.cz/data/current.php',
		success: function(data) {
			$('#koncerty h2').html($('#koncerty h2').html().replace('{{oldkoncertsCount}}', data.result['oldkoncerts-count']));
			$('#koncerty-list').html(Mustache.render(templateKoncerty, addFormaters(data.result)));
		}
	});
			
	$('#photos').html(Mustache.render(templatePhotos, {
		photos: Array(30).fill('00001').map(function(item) {return("00000" + (Math.floor(Math.random() * 437) + 1)).slice(-5)})
	}));
	
});
