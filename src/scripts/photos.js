$(function () {
	setTimeout(function () {
		$('body').append('<script src="http://picasaweb.google.com/data/feed/api/user/juhyxx/albumid/5252817473210531713?kind=photo&alt=json-in-script&thumbsize=243c&callback=setData&fields=entry(summary,gphoto:timestamp , media:group/media:thumbnail)"><\/script>');
	}, 100);

});

function renderPhoto(photo, item) {
	try {
		var date = new Date(parseInt(item['gphoto$timestamp']['$t'], 10));

		$(photo).addClass('loading');
		$('img', photo).attr('src', item['media$group']['media$thumbnail'][0].url);
		$('i', photo).html(item['summary']['$t']);
		$('span', photo).html((date.getDay() + 1) + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear());
	} catch (e) {
		console.error('Unable to render item : ', item, e);
	}
}

function renderPhotos(data) {
	var photos = data.feed.entry;

	var imgMarkup = '<div class="photo loading"><img><i></i><span></span></div>';

	$('article:not(article:first-child)>div')
		.append(imgMarkup)
		.prepend(imgMarkup);

	$('.photo').each(function (index, photo) {
		var rnd = Math.round(Math.random() * photos.length),
			item = photos[rnd];

		setTimeout(function () {
			$('img', photo).load(function () {
				var parent = $(this).parent('.photo');
				parent.removeClass('loading');
				setTimeout(function () {
					var rnd = Math.round(Math.random() * photos.length);
					parent.addClass('loading');
					setTimeout(function () {
						renderPhoto(photo, photos[rnd]);
					}, 3000);
				}, 10000);
			});

			renderPhoto(photo, item);
		}, index * 3000);
	});
}

function setData(data) {
	renderPhotos(data);
}