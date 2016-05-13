$(function() {
  var templateKoncerty = $('#template-koncerty').html(),
    months = [
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

  Mustache.parse(templateKoncerty);

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


});
