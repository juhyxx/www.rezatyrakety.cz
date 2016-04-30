$(function() {

  $("nav a ").click(function(e) {
    e.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;


    $('body').animate({
      scrollTop: top
    }, Math.max(top / 2, 1000));
  });

  $(document).on('scroll', function(e) {
    var position = $(document).scrollTop();
    $('nav a[href=#rakety]').css('left', easing(position));
    $('nav a[href=#nahravky]').css('left', easing(position));
    $('nav a[href=#koncerty]').css('right', easing(position));
    $('nav a[href=#texty]').css('right', easing(position));

    $('#logo').css({
      'transform': 'scale(' + 1 / (easing(position) / 4 + 1) + ')'
    });
  });

  function easing(t) {
    return (t * t * t) / 100000
  }




  var messages = [
      'Bacha!',
      'Vy! Ano Vy!',
      'Míříme přímo na vás!',
      'Ну  Поехали!',
      'Naše rez do Vašich uší...',
      '...Vaše uši do naší sbírky',
      'Bigbít s plochou drahou letu',
      'Žádná raketa není dost zrezlá',
      'Tavíme rez na muziku!',
      'Odpalovací rampa bigbítu',
      'První kosmický bigbít',
      'Poslední kosmický bigbít',
      'Bigbít s jadernou hlavicí',
      'Jsme pohrobci studené války',
      'Rezatá raketa díru do světa neudělá',
      'Hudba z třetího šutru od slunce',
    ],
    counter = 0;

    /*setInterval(function() {
      $('#message').html(messages[counter]);
      counter = counter > messages.length ? 0 : counter + 1;
}, 2000);*/

});
