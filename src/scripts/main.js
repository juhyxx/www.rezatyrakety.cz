$(function () {

	$('header, article').css({
		'min-height': window.innerHeight
	});

	$(window).resize(function () {
		$('header, article').css({
			'min-height': window.innerHeight
		});
	});

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

	setInterval(function () {
		$('#message').html(messages[counter]);
		counter = counter > messages.length ? 0 : counter + 1;
	}, 1500);

});