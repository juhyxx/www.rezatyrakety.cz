$(function() {
  setTimeout(function() {
    $('body').append('<script src="http://picasaweb.google.com/data/feed/api/user/juhyxx/albumid/5252817473210531713?kind=photo&alt=json-in-script&thumbsize=200c&callback=setData&fields=entry(summary,gphoto:timestamp , media:group/media:thumbnail)"><\/script>');
  }, 100);

  $(window).resize(function() {
    var h = $('body').height();

    $('#photos').height(h - 100);
  })

});

function renderPhoto(photo, photos) {
  var rnd = Math.round(Math.random() * photos.length),
    item = photos[rnd];

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

function setData(data) {
  var imgMarkup = '<div class="photo loading"><img><i></i><span></span></div>';
  var imgHeight = 200 + 2 * 15;
  var count = Math.floor($(document).height() / imgHeight);

  for (var i = 0; i < count - 1; i++) {
    $('body #photos').append(imgMarkup);
  }
  renderPhotos(data.feed.entry, true);
}