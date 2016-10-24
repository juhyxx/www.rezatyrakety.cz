document.addEventListener('DOMContentLoaded', function() {

	$('nav a, #floating-nav a').click(function(e) {
		e.preventDefault();
		var id = $(this).attr('href'),
			top = $(id).offset().top;

		$('body').animate({scrollTop: top}, Math.max(top / 2, 1000));
	});

	$(document).on('scroll', function(e) {
		var position = $(document).scrollTop(),
			scale = 1 / (position / 80 + 1),
			navTop = $('#koncerty').offset().top;

		$('a[href="#texty"]', 'nav').css('left', easing(position));
		$('a[href="#nahravky"]', 'nav').css('left', easing(position));
		$('a[href="#koncerty"]', 'nav').css('right', easing(position));
		$('a[href="#rakety"]', 'nav').css('right', easing(position));
		$('#logo').css({'transform': 'scale(' + scale + ')'});
		$('#floating-nav').css(
			position > navTop ? {position: 'fixed',top: '1.5em'} : {
				position: '',
				top: ''
			}
		);
	});

	function easing(t) {
		return (t * t * t) / 100000;
	}

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
					var date = new Date(render(text) * 1000);
					return '<i>' + days[date.getDay() - 1] + '</i> ' + date.getDate() + '. ' + months[date.getMonth()] + ' ' + date.getFullYear();

				};
			},
			timeFormat: function() {
				return function(text, render) {
					var date = new Date(render(text) * 1000);
					return date.getHours() + '. ' + ('0' + date.getMinutes()).slice(-2);
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


	$(function() {
		setTimeout(function() {
			$('body').append('<script src="http://picasaweb.google.com/data/feed/api/user/juhyxx/albumid/5252817473210531713?kind=photo&alt=json-in-script&thumbsize=200c&callback=setData&fields=entry(summary,gphoto:timestamp , media:group/media:thumbnail)"><\/script>');
		}, 100);

		$(window).resize(function() {
			var h = $('body').height();

			$('#photos').height(h - 100);
		});

	});

	function renderPhoto(photo, photos) {
		var rnd = Math.round(Math.random() * photos.length),
			item = photos[rnd];

		try {
			var date = new Date(parseInt(item.gphoto$timestamp.$t, 10));

			$(photo).addClass('loading');
			$('img', photo).attr('src', item.media$group.media$thumbnail[0].url);
			$('i', photo).html(item.summary.$t);
			$('span', photo).html((date.getDay() + 1) + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear());
		} catch (e) {
			console.error('Unable to render item : ', item, e);
		}
	}

	function renderPhotos(photos) {
		$('.photo').each(function(index, photoEl) {
			setTimeout(function() {
				$('img', photoEl).load(function() {
					var parent = $(this).parent('.photo');
					parent.removeClass('loading');
				/*setTimeout(function() {
				  parent.addClass('loading');
				  setTimeout(function() {
				    renderPhoto(photoEl, photos);
				  }, 3000);
				  }, 10000);*/
				});
				renderPhoto(photoEl, photos);
			}, index * 200);
		});
	}

	window.setData = function(data) {
		var imgMarkup = '<div class="photo loading"><img><i></i><span></span></div>';
		var imgHeight = 200 + 2 * 15;
		var count = Math.floor($(document).height() / imgHeight);

		for (var i = 0; i < count - 1; i++) {
			$('body #photos').append(imgMarkup);
		}
		renderPhotos(data.feed.entry, true);
	};


});
