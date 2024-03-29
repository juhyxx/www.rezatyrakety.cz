
CREATE TABLE `kluby` (
  `id` int(11) NOT NULL,
  `jmeno` varchar(250) COLLATE utf8_czech_ci NOT NULL DEFAULT '',
  `adresaUlice` varchar(250) COLLATE utf8_czech_ci DEFAULT NULL,
  `adresaMesto` varchar(250) COLLATE utf8_czech_ci NOT NULL DEFAULT '',
  `WWW` varchar(250) COLLATE utf8_czech_ci DEFAULT NULL,
  `linkMapa` varchar(250) COLLATE utf8_czech_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;



INSERT INTO `kluby` (`id`, `jmeno`, `adresaUlice`, `adresaMesto`, `WWW`, `linkMapa`) VALUES
(1, 'Casino Royal', NULL, 'Dobřany', NULL, '49°39\'16.13\"N,13°17\'25.94\"E'),
(2, 'Kerio', NULL, 'Plzeň', NULL, '49°44\'45.55\"N,13°22\'57.95\"E'),
(3, 'The Pub', 'Prešovská 16', 'Plzeň', 'http://www.thepub.cz', '49°44\'48.37\"N,13°22\'28.35\"E'),
(4, 'New Club', 'Prešovská 3', 'Plzeň', NULL, '49°44\'47.22\"N,13°22\'33.49\"E'),
(5, 'Hospoda u Jima', 'Staniční 2', 'Plzeň - Doubravka', NULL, '49°45\'29.36\"N,13°25\'4.63\"E'),
(6, 'Akord', 'V celnici 4', 'Praha', 'http://www.akord-jazz.com', '50°5\'17.4\"N,14°25\'49.13\"E'),
(7, 'Majáles', NULL, 'Plzeň', 'http://plzen.majales.cz', '49°45\'38.02\"N,13°21\'45.1\"E'),
(8, 'Cardinal club', 'Kardinála berana 10', 'Plzeň', 'http://www.balda.cz/cc/', '49°44\'37.82\"N,13°22\'12.61\"E'),
(9, 'Kerio MusicFestival', NULL, 'Plzeň - Hradiště', 'http://musicfest.kerio.cz', '49°42\'38.67\"N,13°23\'58.05\"E'),
(10, 'Motorest', NULL, 'Dobřany', NULL, '49°40\'36.21\"N,13°19\'30.73\"E'),
(11, 'Statek', NULL, 'Býkov', NULL, '49°51\'31.72\"N,13°25\'13.43\"E'),
(12, 'Na Bayerce', NULL, 'Vstiš', NULL, '49°38\'34.94\"N,13°14\'53.19\"E'),
(13, 'Klub Morrison', 'Vítězství 20/3', 'Mariánské Lázně-Hamrníky', 'http://www.klubmorrison.info', '49°57\'5.07\"N,12°41\'10.75\"E'),
(14, 'Blues sklep', 'Liliová ulice', 'Praha', 'http://www.bluessklep.cz', '50°5\'8.54\"N,14°24\'59.03\"E'),
(15, 'JEKYLLHYDE club', 'Americká 1', 'Plzeň', 'http://www.jekyllhyde.cz', '49°44\'37.76\"N,13°22\'21.76\"E'),
(16, 'Jazz Blues Pub', 'Víta Nejedlého 4707/3', 'Most', 'http://www.jazzbluespub.com', '50°29\'52.1\"N,13°38\'22.12\"E'),
(17, 'Marty\'s club', 'Jirsíkova 2', 'České Budějovice', NULL, '48°58\'22.28\"N,14°28\'37.48\"E'),
(18, 'Hotel Continental', 'Zbrojnická 8', 'Plzeň', NULL, '49°44\'46.23\"N,13°22\'45.64\"E'),
(19, 'A Studio Rubín', 'Malostranské nám. 9', 'Praha', 'http://www.astudiorubin.cz', '50°5\'15.68\"N,14°24\'10.41\"E'),
(20, 'Café Na půl cesty', 'Centrální park Pankrác', 'Praha', 'http://www.greendoors.cz/cafeindex.htm', '50°2\'59.34\"N,14°25\'53.43\"E'),
(21, 'Klub Kapsa', 'Klatovská 140', 'Plzeň', NULL, '49°43\'49.83\"N,13°22\'11.37\"E'),
(22, 'Kavárna & Klub Velbloud', 'U Tří lvů 4', 'České Budějovice', 'http://www.velbloud.info', '48°58\'15.84\"N,14°28\'46.06\"E'),
(23, 'Jet Club', 'Orebitská 5', 'Praha 3 - Žižkov', 'http://www.jetclub.cz', '50°5\'10.78\"N,14°26\'47.48\"E'),
(24, 'Blues Rock Club', 'Nádražní ulice 39/76', 'Praha - Smíchov', 'http://www.bluesrockclub.cz/', '50°4\'0.66\"N,14°24\'27.66\"E'),
(25, 'Mravenčí skála', 'Kosmonautů 1266', 'Strakonice', 'http://www.mravenciskala.wz.cz', '49°15\'34.89\"N,13°53\'40.04\"E'),
(26, 'Motoráj klub', 'Novovysočanská 892/2b', 'Praha 9, Krejcárek', 'http://www.motorajclub.cz', '50°5\'50.67\"N,14°28\'48.93\"E'),
(27, 'House Of Blues', 'Černická 10', 'Plzeň', 'http://www.houseofblues.cz', '49°44\'21.86\"N,13°22\'50.67\"E'),
(28, 'Highway 61', 'Jirsíkova 2', 'České Budějovice', 'http://www.club-highway61.unas.cz', '48°58\'34.27\"N,14°28\'33.27\"E'),
(29, 'XT3', 'Rokycanova 29', 'Praha 3 - Žižkov', 'http://www.xt3.cz', '50°5\'9.87\"N,14°27\'19.19\"E'),
(30, 'Hifi klub', 'Náměstí Republiky 12', 'Plzeň', NULL, '49°44\'49.04\"N,13°22\'42.55\"E'),
(31, 'Venkovní podium', NULL, 'Řepice u Strakonic', NULL, '49°16\'50.53\"N,13°56\'0.68\"E'),
(32, 'Vstiš', NULL, 'Vstiš', NULL, NULL),
(33, 'Kulturní kavárna Jabloň', 'Krátká 2', 'Plzeň', 'http://www.jablon.eu', '49°44\'51.24\"N,13°21\'43.77\"E'),
(34, 'KD Žilov', NULL, 'Žilov', 'http://www.volny.cz/zilovska_beseda/', '49°50\'21.48\"N,13°18\'19.74\"E'),
(35, 'Nezbavětice', NULL, 'Nezbavětice', NULL, '49°39\'17.38\"N,13°28\'40.43\"E'),
(36, 'Autoservis', NULL, 'Zruč u Plzně', '', '49°48\'25.61\"N,13°25\'42.12\"E'),
(37, 'Autocamp', NULL, 'Habr u Volduch', 'http://home.tiscali.cz/cz353401/atc-habr/cz.html', '49°47\'27.4\"N,13°39\'1.55\"E'),
(38, 'Buena Vista Club', 'Kollárova 20', 'Plzeň', 'http://www.buenavistaclub.cz', '49°44\'51.947\"N, 13°22\'8.316\"E'),
(39, 'Stodola', NULL, 'Chloumek u Kasejovic', NULL, '49°29\'4.54\"N,13°43\'36.51\"E'),
(40, 'Bumerang Music Club', 'Víta Nejedlého 4707/3', 'Most', 'http://www.musicpub.cz', '50°29\'52.1\"N,13°38\'22.12\"E'),
(41, 'Plzeňský Prazdroj', NULL, 'Plzeň', NULL, NULL),
(42, 'Nepomuk', NULL, 'Nepomuk', NULL, NULL),
(43, 'Divadélko JoNáš', 'Kopeckého sady 13', 'Plzeň', 'http://www.espritplzen.cz', '49°44\'39.317\"N, 13°22\'35.886\"E'),
(44, 'U Havránka', 'Hřbitovní 873/24', 'Plzeň', NULL, '49°45\'18.914\"N, 13°25\'34.586\"E'),
(45, 'Sportkemp Kralovice', NULL, 'Kralovice', 'http://sportkemp.wz.cz/', '49°58\'59.97\"N, 13°28\'15.48\"E'),
(46, 'Svoboda', 'Za mostní branou 5', 'Cheb', NULL, '50°5\'0.508\"N, 12°22\'10.992\"E'),
(47, 'Jam', 'Doudlevecká 27', 'Plzeň', 'http://www.jam-club.cz', '49°44\'19.735\"N, 13°22\'48.169\"E'),
(48, 'Ledovec', 'Ledce 1', 'Ledce', 'http://www.ledovec.cz', '49°49\'18.536\"N, 13°19\'37.876\"E'),
(49, 'Festival Plzeň Pro Rock', NULL, 'Plzeň - Hradiště', 'http://www.replayrock.cz/plzenprorock.php', '49°42\'38.67\"N,13°23\'58.05\"E'),
(50, 'Kerio MusicFestival', 'Radčická 2861/2', 'Plzeň', 'http://musicfest.kerio.cz', '49°45\'1.685\"N, 13°22\'12.262\"E'),
(51, 'Solnice', 'Česká 66', 'České Budějovice', 'http://www.bazilika.cz/www/', '48°58\'35.305\"N, 14°28\'22.134\"E'),
(52, 'B-klub', 'Na Palcátech 352', 'Kralovice', NULL, '49°58\'56.431\"N, 13°29\'5.383\"E'),
(53, 'Kulturní dům (venkovní parket)', NULL, 'Hadačka ', NULL, '49°57\'50.242\"N, 13°27\'20.816\"E'),
(54, 'zahrada Měšťanské Besedy', 'Kopeckého sady 59/13', 'Plzeň', NULL, '49°44\'39.809\"N, 13°22\'36.332\"E'),
(55, 'Farní zahrada', NULL, 'Staré Sedliště', NULL, '49°44\'31.3\"N, 12°41\'24.823\"E'),
(56, 'Chapeau Rouge', 'Jakubská 647/2', 'Praha', 'http://www.chapeaurouge.cz', '50°5\'17.082\"N, 14°25\'29.329\"E'),
(57, 'Anděl Café - Music Bar', 'Bezručova 7', 'Plzeň', 'http://www.andelcafe.cz', '49°44\'43.223\"N, 13°22\'37.641\"E'),
(58, 'Klub Paderewski, Divadlo Husovka', 'Husovo nám. 2', 'Karlovy Vary', 'http://www.husovka.info', '50°13\'11.879\"N, 12°52\'50.519\"E'),
(59, 'Kulturní centrum Rakovník', 'Na Sekyře 2377', 'Rakovník', 'http://www.kulturnicentrum.cz/', '50°6\'13.325\"N, 13°44\'0.237\"E'),
(60, 'Pohoda', 'Československé armády 30', 'Kadaň', 'http://www.facebook.com/group.php?v=wall&gid=207390620444', '50°22\'39.478\"N, 13°16\'6.871\"E'),
(61, 'Utopie', 'Poděbradova 12', 'Plzeň', 'http://www.utopierock.cz', '49°44\'48.268\"N, 13°22\'4.269\"E'),
(62, 'Rock for J.K.', 'Hřiště', 'Manětín', NULL, '49°59\'26.763\"N, 13°14\'10.139\"E'),
(63, 'Rock Klub Kain', 'Husitská 1', 'Praha', 'http://www.kain.cz/', NULL),
(64, ' Sokolovna Blovice', 'Tyršova 270', 'Blovice', NULL, NULL),
(65, 'Carpe Diem', 'Jičínská 4', 'Praha', 'http://carpediempraha.cz', NULL),
(66, 'Kryt CO (pod klášterem)', NULL, 'Plasy', 'http://www.ntm.cz/aktualita/11-1282012-plaska-pout', '49°56\'4.608\"N, 13°23\'24.530\"E'),
(67, 'U Faflíků na dvoře', NULL, 'Rousínov u Rakovníka', NULL, NULL),
(68, 'Festival Živá ulice', NULL, 'Plzeň', 'http://www.zivaulice.eu', NULL),
(69, 'U koblížka', NULL, 'Plzeň-Černice', NULL, '49°41\'52.325\"N, 13°24\'49.957\"E'),
(70, 'Exit-us', 'Sokolovská 972/195', 'Praha 9', 'http://www.exitchmelnice.cz/', '50°6\'25.920\"N, 14°29\'20.429\"E'),
(71, 'KD', NULL, 'Horní Bělá', NULL, '49°53\'19.781\"N, 13°15\'57.291\"E'),
(72, 'U Jána', 'Nádražní 18', 'Plzeň', NULL, '49°44\'42.423\"N, 13°23\'12.212\"E'),
(73, 'Zach\'s Pub', 'Palackého nám. 2', 'Plzeň', 'http://www.zachspub.cz', '49.7482117N, 13.3709853E'),
(74, 'Sokolovna', 'Palackého', 'Podivín', NULL, NULL),
(75, 'Únětický pivovar', 'Rýznerova 19/5', 'Únětice', 'http://www.unetickypivovar.cz/', '50°8\'56.335\"N, 14°21\'15.365\"E'),
(76, 'Rocknwall ', 'Sady 5.května 24', 'Plzeň', 'http://www.rocknwall.cz', '49°44\'57.754\"N, 13°22\'46.290\"E'),
(77, 'Vlašský dvůr', 'Havlíčkovo náměstí', 'Kutná Hora', NULL, '49°56\'53.884\"N, 15°16\'6.603\"E'),
(78, 'Kontejnery k světu ', 'Lochotinský pavilonek', 'Plzeň', 'https://www.facebook.com/pages/Showpoint-CZ/445808712157899', NULL),
(79, 'Prostor', 'tř.J.P.Koubka 23', 'Blatná', 'http://www.restaurace-prostor.cz/', '49°25\'38.368\"N, 13°52\'56.303\"E'),
(80, 'Šeříkovka', 'Šeříková 2428/13', 'Plzeň 2', 'http://www.serikovka.cz/', '49°43\'26.549\"N, 13°24\'23.663\"E'),
(81, ' KC Nová Beseda', 'Slavětínská 120', 'Praha 9 – Klánovice', 'http://kcnovabeseda.cz/', '50°5\'48.646\"N, 14°40\'13.191\"E'),
(82, 'Bus Restaurant', NULL, 'Ostrov u Stříbra', NULL, '49°42\'2.041\"N 13°2\'39.383\"E'),
(83, 'Pivovar', NULL, 'Chříč', NULL, '49°58\'21.385\"N 13°38\'48.718\"E'),
(84, 'Chebské dvorky', NULL, 'Cheb', 'http://chebskedvorky.galerie4.cz/', '50°4\'38.101\"N, 12°22\'2.646\"E'),
(85, 'Zahrada', 'Vosí č.p. 7', 'Švihov', '', '49.4601736°N, 13.3179536°E'),
(86, 'Kemp', NULL, 'Kralovice', NULL, '49°58\'59.273\"N, 13°28\'14.817\"E'),
(87, 'Hospůdka na Sportovním areálu', 'Sportovní 515', 'Zruč-Senec', NULL, '49°48\'14.719\"N, 13°25\'26.225\"E'),
(88, 'Hudební klub Irská', 'Sedlecká 1', 'Karlovy Vary', 'https://www.facebook.com/hudebniklubIrska?fref=ts', '50.2367992N, 12.8647708E'),
(89, 'HIGHWAY 61 Jazz & Blues Club', 'Jirsíkova 2', 'České Budějovice', 'http://www.club-highway61.cz/', '48.9719972N, 14.4759278E'),
(90, 'Restaurace a bar ŠACHMAT', 'Purkyňova 994/29', 'Plzeň - Jižní Předměstí', 'http://www.sach-mat.cz', '49.7408133N, 13.3749525E'),
(91, 'FAV ZČU v Plzni ', 'Univerzitní 8', 'Plzeň', NULL, NULL),
(92, 'Sitcom music club & bar', 'Prešovská 16', 'Plzeň', NULL, '49.7467781N, 13.3745450E'),
(93, 'Festival', 'Národní 400', 'Habartov', 'http://muzeum-habartov.eu/', '50.1873286N, 12.5658917E'),
(94, 'Kafe? Panoptikum', 'Kardinála Berana 14', 'Plzeň ', 'http://panco.cz/', '49.7436228N, 13.3701428E'),
(95, 'Rebel Alfa Music Club', 'Americká 663/17', 'Plzeň', 'http://www.alfarebel.cz/', '49.7437889N, 13.3749503E'),
(96, 'Museum Czech Underground', 'Chvalšinská', 'Český Krumlov', NULL, '48.8179600N, 14.3058786E'),
(97, 'Gambrinus Den', 'U branky', 'Plzeň', 'http://www.gambrinus.cz/gambrinusden', '49.7450558N, 13.3758689E'),
(98, 'Dny Světlé - Evropský den sousedů', 'Karoliny Světlé 13', 'Plzeň', NULL, '49.7650592N, 13.3669344E'),
(99, 'Restaurace Music Club Karlov', 'Na Pomezí 22', 'Plzeň', 'https://rmckarlovplzen.eatbu.com/', '49.7346533N, 13.3485733E'),
(100, 'TechHeavenCZ', 'Cukrovarská 20', 'Plzeň', NULL, '49.7367678N, 13.3816147E'),
(101, 'Městská plovárna Plzeň', 'Doudlevecká 71', 'Plzeň', 'http://plovarna.plzne.cz/kontakt/', '49.7324675N, 13.3796231E'),
(102, 'Vinyl Club & Café', 'Klatovská třída 138', 'Plzeň', 'https://www.facebook.com/vinylclubcafe/', '49.7307817N, 13.3696708E'),
(103, 'Lidový dům', 'Raisova 2', 'Starý Plzenec', NULL, '49.7026061N, 13.4704475E'),
(104, 'Proluka', NULL, 'Plzeň', NULL, NULL),
(105, 'Restaurace Kotva Hracholusky', NULL, 'Úlice', 'https://www.facebook.com/Restaurace-Kotva-Hracholusky-716546948455299', '49.7906494N, 13.1704139E'),
(106, 'Pod Kopcem', 'Božkovské náměstí 101/18', 'Plzeň-Božkov', NULL, '49.7324928N, 13.4237250E'),
(107, 'Soukromá akce', NULL, 'Pavlovice', NULL, NULL),
(108, 'Bar u Kylla', 'Resslova 17', 'Plzeň', 'https://www.facebook.com/barukylla/', NULL),
(109, 'Hostinec pod rozhlednou', NULL, 'Železný Újezd', NULL, NULL),
(110, 'U Branky', NULL, 'Plzeň', NULL, NULL),
(111, 'lokál U Jirky Plzeň', 'Doudlevecká 437/9', 'Plzeň', NULL, NULL),
(112, 'Hospoda Tachovská', 'Tachovská 2189', 'Plzeň', 'https://www.hospoda-tachovska.cz/o-nas-3/', '49.7838350N, 13.3823936E'),
(113, 'U Křelovců', 'Mikulášské náměstí 20', 'Plzeň', NULL, NULL),
(114, 'Bar U Souseda', 'Prešovská 197/16', 'Plzeň', NULL, NULL),
(115, 'Bílej Medvěd', 'Prokopova 336', 'Plzeň ', NULL, NULL),
(116, 'Restaurace U Komína', 'Karlovarská 123/126', 'Plzeň 1', NULL, NULL);

-- --------------------------------------------------------


CREATE TABLE `koncerty` (
  `trojkazblues_flag` int(1) NOT NULL,
  `id` int(11) NOT NULL,
  `datum` datetime NOT NULL,
  `poznamka` varchar(250) COLLATE utf8_czech_ci NOT NULL DEFAULT '',
  `klub_id` int(11) NOT NULL DEFAULT '0',
  `zruseno_flag` int(1) NOT NULL DEFAULT '0',
  `linkFoto_flag` int(1) NOT NULL DEFAULT '0',
  `soukromaAkce_flag` int(1) NOT NULL DEFAULT '0',
  `fblink` varchar(255) COLLATE utf8_czech_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;



INSERT INTO `koncerty` (`trojkazblues_flag`, `id`, `datum`, `poznamka`, `klub_id`, `zruseno_flag`, `linkFoto_flag`, `soukromaAkce_flag`, `fblink`) VALUES
(0, 1, '2005-12-16 20:30:00', '', 1, 0, 1, 0, ''),
(0, 2, '2005-12-21 19:00:00', '', 2, 0, 1, 1, ''),
(0, 3, '2006-01-12 20:30:00', '', 3, 0, 1, 0, ''),
(0, 4, '2006-02-09 20:30:00', '', 4, 0, 1, 0, ''),
(0, 5, '2006-02-17 20:00:00', '', 5, 0, 1, 0, ''),
(0, 6, '2006-03-09 20:00:00', '', 4, 0, 0, 0, ''),
(0, 7, '2006-04-27 20:00:00', '', 6, 0, 1, 0, ''),
(0, 8, '2006-04-29 15:00:00', '', 7, 0, 1, 0, ''),
(0, 9, '2006-05-12 20:00:00', '', 8, 0, 0, 0, ''),
(0, 10, '2006-05-27 20:00:00', '', 9, 0, 1, 0, ''),
(0, 11, '2006-06-23 20:00:00', '', 10, 0, 0, 0, ''),
(0, 12, '2006-06-29 20:00:00', '', 11, 0, 0, 0, ''),
(0, 13, '2006-07-14 20:00:00', '+ PMP blues band', 13, 0, 1, 0, ''),
(0, 14, '2006-08-18 20:00:00', '', 14, 0, 0, 0, ''),
(0, 15, '2006-09-08 20:00:00', '', 2, 0, 1, 1, ''),
(0, 16, '2006-09-16 20:00:00', '', 15, 0, 0, 0, ''),
(0, 17, '2006-09-22 20:00:00', '', 16, 0, 0, 0, ''),
(0, 18, '2006-10-12 20:00:00', '', 17, 1, 0, 0, ''),
(0, 19, '2006-10-26 20:00:00', '', 18, 0, 0, 0, ''),
(0, 20, '2006-11-10 20:00:00', '', 19, 0, 0, 0, ''),
(0, 21, '2006-11-28 20:00:00', '', 20, 0, 0, 0, ''),
(0, 22, '2006-12-08 20:00:00', '', 8, 0, 0, 0, ''),
(0, 23, '2006-12-16 20:00:00', 'křest CD Blues na cesty', 21, 0, 1, 0, ''),
(0, 24, '2007-01-12 20:00:00', '', 25, 0, 1, 0, ''),
(0, 25, '2007-01-20 21:00:00', '', 22, 0, 0, 0, ''),
(0, 26, '2007-01-24 21:00:00', '+ The Leaders', 27, 0, 0, 0, ''),
(0, 27, '2007-01-27 20:00:00', '+ The Mordors Gang', 26, 0, 0, 0, ''),
(0, 28, '2007-02-09 20:00:00', '', 16, 1, 0, 0, ''),
(0, 29, '2007-02-17 21:00:00', '+ host', 14, 0, 1, 0, ''),
(0, 30, '2007-03-01 20:00:00', '', 23, 0, 0, 0, ''),
(0, 31, '2007-03-10 20:00:00', '', 18, 1, 0, 0, ''),
(0, 32, '2007-03-23 20:00:00', '', 24, 0, 0, 0, ''),
(0, 33, '2007-04-02 20:00:00', 'Soutěž Startér LIVE!', 29, 0, 0, 0, ''),
(0, 34, '2007-04-05 20:00:00', '+ Drsná stěna', 30, 0, 1, 0, ''),
(0, 35, '2007-05-11 21:00:00', '', 28, 1, 0, 0, ''),
(0, 36, '2007-05-26 14:00:00', '', 9, 0, 1, 0, ''),
(0, 37, '2007-04-28 18:00:00', '', 7, 1, 0, 0, ''),
(0, 38, '2007-05-25 20:00:00', '+ ASPM', 31, 0, 1, 0, ''),
(0, 39, '2007-06-07 20:00:00', '', 30, 0, 1, 0, ''),
(0, 40, '2007-06-29 21:00:00', '(Dva roky ve štychu)', 32, 0, 0, 0, ''),
(0, 41, '2007-05-03 20:00:00', '', 33, 1, 0, 0, ''),
(0, 42, '2007-10-05 20:00:00', '+ ASPM', 34, 0, 0, 0, ''),
(0, 43, '2007-06-22 20:00:00', 'Rusty Rocket unplugged', 33, 0, 1, 0, ''),
(0, 44, '2007-06-16 20:00:00', '', 35, 0, 1, 0, ''),
(0, 45, '2007-05-12 20:30:00', '', 36, 1, 0, 1, ''),
(0, 46, '2007-07-05 20:00:00', '+ Drsná stěna', 37, 0, 0, 0, ''),
(0, 47, '2007-09-21 21:00:00', '', 28, 0, 1, 0, ''),
(0, 48, '2007-09-20 20:00:00', '', 38, 0, 1, 0, ''),
(0, 49, '2007-08-18 19:00:00', '', 39, 0, 0, 0, ''),
(0, 50, '2007-09-14 19:00:00', '', 2, 0, 1, 1, ''),
(0, 51, '2007-11-02 20:00:00', '', 40, 0, 0, 0, ''),
(0, 52, '2007-06-29 16:00:00', '', 41, 0, 0, 1, ''),
(0, 53, '2007-11-10 18:00:00', '', 42, 1, 0, 0, ''),
(0, 54, '2007-12-21 19:30:00', '+ Dvanapůl (Juhy + Lamanai)', 43, 1, 0, 0, ''),
(0, 55, '2008-06-24 20:00:00', '', 20, 1, 0, 0, ''),
(0, 56, '2007-06-30 20:00:00', '', 12, 0, 0, 0, ''),
(0, 57, '2008-02-28 20:00:00', '', 38, 1, 0, 0, ''),
(0, 59, '2008-08-29 18:00:00', '+ T.H.R.', 44, 0, 0, 1, ''),
(0, 61, '2008-10-02 20:00:00', '+ Stop-time', 30, 0, 0, 0, ''),
(0, 62, '2008-09-26 20:00:00', '+ Bluesbreakers Václava Filky', 46, 0, 0, 0, ''),
(0, 63, '2008-12-18 20:00:00', 'Blues pod stromeček - vánoční koncert plzeňského bluesového podhoubí', 38, 0, 0, 0, ''),
(0, 64, '2008-12-17 21:00:00', 'No Exit', 47, 0, 0, 0, ''),
(0, 65, '2009-05-30 18:00:00', '', 50, 0, 0, 0, ''),
(0, 66, '2009-04-25 16:00:00', '', 7, 1, 0, 0, ''),
(1, 67, '2009-03-05 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/dlouhejkour\">Dlouhej kouř</a> (Rakovník)</li>   <li> <a href=\"http://bandzone.cz/bluesbreakersvaclavafilky\">Bluesbreakers Václava Filky</a> (Cheb)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(0, 68, '2009-05-23 15:00:00', 'Velmi kulturní odpoledne', 48, 1, 0, 0, ''),
(0, 69, '2009-06-20 14:00:00', '', 49, 0, 0, 0, ''),
(0, 70, '2009-07-25 20:00:00', '', 39, 0, 0, 0, ''),
(0, 71, '2009-06-19 20:00:00', '+ Blueset', 51, 1, 0, 0, ''),
(1, 72, '2009-06-03 20:00:00', '<ul>   <li><a href=\"http://www.jedubaby.cz\">Jedubaby</a> (Chlumčany)</li>   <li> <a href=\"http://bandzone.cz/bernardbluesband\">Bernard blues band</a> (Karlovy Vary)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(0, 73, '2009-04-03 21:00:00', '+ Nadoraz', 52, 0, 0, 0, ''),
(0, 74, '2009-05-15 20:00:00', '+ Nadoraz', 53, 0, 0, 0, ''),
(0, 75, '2009-09-18 20:00:00', '+ Dlouhej kouř', 47, 1, 0, 0, ''),
(0, 76, '2009-09-19 14:00:00', 'Na Ledovec! + Pocket Elephants', 48, 0, 0, 0, ''),
(1, 77, '2009-10-07 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/bluezebra3\">Blue Zebra 3</a> (Plzeň)</li>   <li>  <a href=\"http://bandzone.cz/thefollowers\">The Followers</a> (Rakovník)</li>   <li> Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(1, 78, '2009-11-04 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/hendrixfriends\">Hendrix Friends</a> (Praha)</li>   <li> <a href=\"http://bandzone.cz/bernardbluesband\">Bernard Blues Band</a> (Karlovy Vary)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(0, 79, '2009-07-01 20:00:00', '+ Blue Zebra 3', 54, 0, 0, 0, ''),
(0, 80, '2009-08-29 18:00:00', '', 55, 0, 0, 0, ''),
(0, 81, '2010-06-05 20:00:00', '', 50, 0, 0, 0, ''),
(1, 82, '2009-12-02 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/bluezebra3\">Blue Zebra 3</a> (Plzeň)</li>   <li><a href=\"http://bandzone.cz/stoptime\">Stop Time Trio</a> (Plzeň)</li>   <li>Rezatý Rakety (Plzeň) <em>+ křest live CD RR </em></li> </ul>', 38, 0, 0, 0, ''),
(1, 83, '2010-01-13 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/pocketelephants\">Pocket Elephants</a> (Plzeň)</li>   <li> <a href=\"http://bandzone.cz/nucenyvysek\">Nucený výsek</a> (Kadaň)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(1, 84, '2010-02-03 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/bluespodpsa\">Blues Pod psa</a> (Praha)</li>   <li>Old School Band (Plzeň)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(1, 85, '2010-03-04 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/dlouhejkour\">Dlouhej kouř</a> (Rakovník)</li>   <li><a href=\"http://bandzone.cz/blueset\">Blueset</a> (České Budějovice)</li>   <li>Rezatý Rakety (Plzeň)</li> </ul>', 38, 0, 0, 0, ''),
(0, 86, '2010-01-14 20:00:00', '+ Blues Pod psa', 56, 0, 0, 0, ''),
(0, 87, '2010-09-24 20:00:00', '', 13, 0, 0, 0, ''),
(1, 88, '2010-04-01 20:00:00', '<ul>   <li><a href=\"http://manillajoe.wz.cz/\">Manilla Joe </a>(České Budějovice)</li>   <li> Old Shool Band  (Plzeň)</li>   <li><a href=\"http://bandzone.cz/stoptime\">Stop Time Trio</a> (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(1, 89, '2010-05-05 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/bernardbluesband\">Bernard Blues Band</a> (Karlovy Vary)</li>   <li><a href=\"http://bandzone.cz/thekingsizeboogiemen\">The Kingsize Boogiemen</a> (Praha)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(1, 90, '2010-06-02 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/oldculture\">Old Culture</a> (Tábor)</li>   <li> <a href=\"http://bandzone.cz/nadorazrock\">Nadoraz Rock</a> (Kralovice)</li>   <li> Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(0, 91, '2010-04-27 20:00:00', '+ Dlouhej kouř', 57, 0, 0, 0, ''),
(0, 92, '2010-04-24 15:40:00', '', 7, 0, 0, 0, ''),
(0, 93, '2010-05-07 19:30:00', '+ Bernard Blues Band', 58, 0, 0, 0, ''),
(0, 94, '2010-05-08 20:00:00', '', 59, 1, 0, 0, ''),
(0, 95, '2010-07-09 20:00:00', '', 60, 0, 0, 0, ''),
(0, 96, '2010-05-08 19:30:00', '', 61, 0, 0, 0, ''),
(0, 97, '2010-07-05 14:00:00', 'Rock for J.K. + Artur, May Day, Mash, Nadoraz, Playback ', 62, 0, 0, 0, ''),
(1, 98, '2010-09-15 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/somethingreal\">Something Real</a> (Praha)</li>   <li><a href=\"http://www.jedubaby.cz\">Jedubaby</a> (Clumčany)</li>    <li>Rezatý Rakety (Plzeň)</li> </ul>', 38, 0, 0, 0, ''),
(1, 99, '2010-10-06 20:00:00', '<ul><li><a href=\"http://rockers.own.cz/\">The Rockers</a> (Praha)</li><li>Rezatý Rakety (Plzeň)</li> </ul>', 38, 0, 0, 0, ''),
(1, 100, '2010-11-03 20:00:00', '<ul><li><a href=\"http://www.mrakoplas.cz\">Mrakoplaš</a> (Praha)</li><li>Rezatý Rakety (Plzeň)</li><li> <a href=\"http://bandzone.cz/bernardbluesband\">Bernard blues band</a> (Karlovy Vary)</li></ul>', 38, 0, 0, 0, ''),
(1, 101, '2010-12-01 20:00:00', '<ul>   <li><a href=\"http://bandzone.cz/bluezebra3\">Blue Zebra 3</a> (Plzeň)</li>   <li>Old School Band (Plzeň)</li>   <li>Rezatý Rakety (Plzeň) </li> </ul>', 38, 0, 0, 0, ''),
(0, 102, '2010-09-01 20:00:00', '', 61, 0, 0, 0, ''),
(1, 103, '2011-01-12 20:00:00', '<ul><li><a href=\"http://bandzone.cz/bluespodpsa\">Blues pod psa</a> (Praha)</li><li> V.I.B. - Jimi Hendrix inspirations (Praha) </li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=112773875458666'),
(1, 104, '2011-02-02 20:00:00', '<ul><li><a href=\"http://www.manillajoe.wz.cz\">Manilla Joe</a> (České Budějovice)</li><li> Čtvrt na osm (Ledce u Plzně)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=170530692989957'),
(1, 105, '2011-03-02 20:00:00', '<ul><li><a href=\"http://bandzone.cz/dlouhejkour\">Dlouhej kouř</a> (Rakovník)</li><li><a href=\"http://bandzone.cz/message\">Message</a> (Praha)</li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=110579049018102'),
(1, 106, '2011-04-06 20:00:00', '<ul><li>Stoker One Man Band (Chrudim)</li><li><a href=\"http://bandzone.cz/thebluesters\">The Blues Pace</a> (Tábor) </li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=195913227108591'),
(1, 107, '2011-05-04 20:00:00', '<ul><li><a href=\"http://www.hromosvody.net/6602/yardys-band/\">Yardy\s band (Cheb)</a></li><li>Kam běžíte ?! Akustic Band</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=193555450686471'),
(0, 108, '2011-06-01 20:00:00', 'Křest CD', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=215983668429481'),
(0, 109, '2011-06-04 20:00:00', '', 50, 0, 0, 0, 'http://www.facebook.com/event.php?eid=154273821254003'),
(0, 110, '2011-07-05 15:00:00', 'Rock for J.K. ', 62, 0, 0, 0, ''),
(1, 111, '2011-09-13 20:00:00', '<ul><li><a href=\"http://www.svitky.wz.cz/\">Svitky</a></li><li>Old School Band</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=129801217115257'),
(1, 112, '2011-10-05 20:00:00', '<ul>   <li><a href=\"http://www.facebook.com/pages/Electric-Blue/128013539323\">Electric Blue</a></li>   <li>Rezatý Rakety </li> </ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=116936415076713'),
(1, 113, '2011-11-02 20:00:00', '<ul><li><a href=\"http://bandzone.cz/bluezebra3\">Blue Zebra 3</a></li><li><a href=\"http://bandzone.cz/message\">Message</a></li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=259883334055886'),
(0, 114, '2011-12-15 20:00:00', '<ul><li>Message</li><li>Bluesvar</li></ul>', 63, 0, 0, 0, ''),
(1, 115, '2011-12-07 20:00:00', '<ul><li><a href=\"http://bandzone.cz/thebluesters\">Blues Pace</a></li><li><a href=\"http://bandzone.cz/dlouhejkour\">Dlouhej kouř</a></li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/event.php?eid=263257637053903'),
(1, 117, '2012-01-11 20:00:00', '<ul><li>Bluesvar (Praha)</li><li>Greyhound (Plzeň)</li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/events/143406479101212/'),
(1, 118, '2012-02-02 20:00:00', '<ul><li>Old School Band (Plzeň)</li><li><a href=\"http://bandzone.cz/blackbag\">Black Bag (Praha)</a></li><li>Rezatý Rakety(Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/events/305390022845279/'),
(1, 119, '2012-03-07 20:00:00', '<ul><li><a href=\"http://www.mrakoplas.cz\">Mrakoplaš (Praha)</a></li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/events/365627020117100/'),
(1, 120, '2012-04-05 20:00:00', '<ul><li><a href=\"http://bandzone.cz/kusblues\">Kus Blues (Plzeň)</a></li><li><a href=\"http://strasidelny.cz/\">Strašidelný Electric Band(Praha)</a></li><li>Rezatý Rakety (Plzeň)</li></ul>', 38, 0, 0, 0, 'http://www.facebook.com/events/170142283104980/'),
(1, 121, '2012-05-02 20:00:00', '<ul><li>Stoker One Man Band</li><li>Bernard Blues Band</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/425438200803334/'),
(1, 122, '2012-06-06 20:00:00', '<ul>   <li> <a href=\"http://www.mordorsgang.net/\">The Mordors Gang</a></li>   <li><a href=\"http://bandzone.cz/bluezebra3\">Blue Zebra 3</a></li>   <li>Rezatý Rakety</li> </ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/298168440268944/'),
(0, 123, '2012-03-20 20:00:00', '<b>Pražská trojka (z blues):</b><ul><li><a href=\"http://www.svitky.wz.cz/\">Svitky (www.svitky.wz.cz)</a></li><li>Rezatý rakety</li><li><a href=\"http://strasidelny.cz\">Strašidelný elektrik band</a></li>', 65, 0, 0, 0, 'http://www.facebook.com/events/159980847456937/'),
(0, 124, '2012-07-05 16:00:00', '', 62, 0, 0, 0, 'https://www.facebook.com/events/139261706184769/'),
(0, 125, '2012-02-03 20:00:00', 'Flaxa', 47, 0, 0, 0, 'http://www.facebook.com/events/319027031471915/'),
(0, 126, '2012-05-19 18:00:00', 'Velmi K.O.', 48, 0, 0, 0, ''),
(0, 127, '2012-08-11 18:00:00', '', 66, 0, 0, 0, 'https://www.facebook.com/events/423015317741429/'),
(1, 128, '2012-09-12 20:00:00', '<ul><li>Jedubaby (Chlumčany)</li><li>Proo-one (Karlovy Vary)</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/483437328342380/'),
(1, 129, '2012-10-03 20:00:00', '<ul><li>Panelákoví Fotři</li><li>Message</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/107733906042613/'),
(1, 130, '2012-11-07 20:00:00', '<ul><li>Bluesvar (Praha)</li><li>Dlouhej kouř (Rakovník)</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/353534588060802/'),
(1, 131, '2012-12-05 20:00:00', '<ul><li>Oni</li><li>The Mordors Gang</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/428244017214979/'),
(0, 132, '2012-08-18 20:00:00', '', 67, 1, 0, 0, ''),
(0, 133, '2012-08-18 14:00:00', '', 68, 0, 0, 0, 'https://www.facebook.com/events/447059671994257/'),
(0, 134, '2012-08-17 20:00:00', '+ Paheyl', 47, 0, 0, 0, 'https://www.facebook.com/events/387770797956246/'),
(0, 135, '2012-09-14 20:00:00', '+ Blue Zebra 3', 69, 0, 0, 0, 'https://www.facebook.com/events/212577985535372/'),
(0, 136, '2012-10-25 20:00:00', '<b>Vyrobeno v Plzni</b></br> + Blue Zebra 3', 70, 0, 0, 0, 'https://www.facebook.com/events/190123071121590'),
(0, 137, '2012-10-13 20:00:00', '<b>Holy George will go to the half of century</b><br><ul><li>Fobie</li><li>Maelström</li><li>Artur</li><li>Flaxa</li><li>Nadoraz</li><li>Ali Bej</li></ul>', 71, 0, 0, 0, 'https://www.facebook.com/events/350793844995827/'),
(0, 138, '2012-09-21 20:00:00', '+ Hardox (Most)', 72, 0, 0, 0, 'https://www.facebook.com/events/372736006133602'),
(0, 139, '2012-11-28 20:30:00', '+ Message<br> + Bluesvar', 63, 0, 0, 0, ''),
(1, 140, '2013-01-16 20:00:00', '<ul><li>‎4 bristols</li><li>The Blues Pace</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/119931701504115/'),
(1, 141, '2013-02-06 20:00:00', '<ul><li>Nonsen (Praha)</li><li>Night Fiction (Praha)</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/395254973887016/'),
(1, 142, '2013-03-06 20:00:00', '<ul><li>Strašidelný elektrik band (Praha)</li><li>Bernard blues band (Karlovy Vary)</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/250722635055971/'),
(1, 143, '2013-04-03 20:00:00', '<ul><li>Haha bimbi (Plzeň)</li><li>Old School band (Plzeň)</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/337629899678075/'),
(1, 144, '2013-05-01 20:00:00', '<ul><li>Film Blues Band</li><li>Luxus</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/395075483908010/'),
(1, 145, '2013-06-05 20:00:00', '<ul><li>Mrakoplaš</li><li>Petruška Hapková & Band</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/431694596880063/'),
(0, 146, '2012-11-02 20:00:00', '<b>Vyrobeno v Plzni</b></br> + Blue Zebra 3', 47, 0, 0, 0, 'https://www.facebook.com/events/239508189508176'),
(0, 147, '2012-11-04 20:00:00', '<b>Noc s Karlem</b><br> + ČINNA ', 73, 0, 0, 0, 'https://www.facebook.com/events/453828061323293/'),
(0, 148, '2013-02-01 20:00:00', '+ Garage', 74, 1, 0, 0, ''),
(0, 149, '2013-01-19 20:00:00', 'Noc s Karlem 2 + Blue Zebra', 75, 0, 0, 0, ''),
(0, 150, '2013-04-19 20:00:00', '', 76, 1, 0, 0, ''),
(0, 151, '2013-05-17 21:00:00', '3.Muzejní noc GFJ ', 77, 0, 0, 0, ''),
(0, 152, '2013-05-15 20:00:00', 'kontejner Showpoint CZ', 78, 0, 0, 0, 'https://www.facebook.com/events/326831214112362/'),
(1, 153, '2013-09-11 20:00:00', '<ul><li>Hostee</li><li>Pan Cicvárek, ovčí člověk</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/471949582888240/'),
(1, 154, '2013-10-02 20:00:00', '<ul><li>Aftersix</li><li>Blue Zebra 3</li><li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/165898920246573/'),
(1, 155, '2013-11-06 20:00:00', '<ul><li>Rezatý Rakety</li><li>Dlouhej kouř</li><li>The Bodytalks</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/153883358127500/'),
(1, 156, '2013-12-04 20:00:00', '<ul>\r\n<li>Panelákoví fotři</li>\r\n<li>Nezahráli</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/659764154040410/'),
(1, 157, '2014-01-15 20:00:00', '<ul>\r\n<li>Blues Pace</li>\r\n<li>Bernard Blues Band</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/364919116976240/'),
(1, 158, '2014-02-05 20:00:00', '<ul>\r\n<li>Sunday4</li>\r\n<li>The Blbs</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/195342023982538/'),
(1, 159, '2014-03-05 20:00:00', '<ul>\r\n<li>Kočku do kotle</li>\r\n<li>Black bag</li>\r\n\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/557865670948818/'),
(1, 160, '2014-04-02 20:00:00', '<ul>\r\n<li>Zo-o-ya</li>\r\n<li>Future Sailors</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1402162543351941/'),
(1, 161, '2014-05-07 20:00:00', '<ul><li>Old Culture</li><li>Jedubaby</li>\r\n<li>Rezatý Rakety</li></ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/757351020958503/'),
(1, 162, '2014-06-04 20:00:00', '<ul>\r\n<li>Slunovratovy paprsky</li>\r\n<li>Fousovo surikata</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/192177810969123/'),
(0, 163, '2014-01-18 20:00:00', '+ Oni', 79, 0, 0, 0, ''),
(2, 164, '2014-02-13 20:00:00', '+ Hostee', 80, 0, 0, 0, 'https://www.facebook.com/events/654754774566445/'),
(0, 165, '2014-05-26 20:00:00', 'Klánovický svařák', 81, 0, 0, 0, ''),
(0, 166, '2014-04-26 20:00:00', '+Oni', 79, 0, 0, 0, ''),
(0, 167, '2014-02-28 20:00:00', '', 82, 0, 0, 0, ''),
(0, 168, '2014-03-01 20:00:00', '', 83, 0, 0, 0, 'https://www.facebook.com/events/733771493302378/?fref=ts'),
(0, 169, '2014-06-14 14:00:00', 'Chebské dvorky', 84, 0, 0, 0, 'https://www.facebook.com/events/263846610477211/'),
(0, 170, '2014-07-05 15:00:00', '', 62, 0, 0, 0, 'https://www.facebook.com/events/1425694997683838'),
(1, 171, '2014-09-17 20:00:00', '<ul>\r\n<li>Trio P.E.S.</li>\r\n<li>Dlouhej kouř</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1548832035337243/'),
(1, 172, '2014-10-01 20:00:00', '<ul>\r\n<li>Message</li>\r\n<li>Bad Stone</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1465014277091884/'),
(1, 173, '2014-11-05 20:00:00', '<ul>\r\n<li>Panelákoví fotři</li>\r\n<li>Fousovo surikata</li>\r\n<li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/562038367251335/'),
(1, 175, '2014-12-03 20:00:00', '<ul>\r\n<li>Haha Bimbi</li>\r\n<li>Rezatý Rakety</li>\r\n<li>Blues klan</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1547560215455550/'),
(0, 176, '2014-08-30 15:00:00', '<ul>\r\n<li>Bluesberry</li>\r\n<li>Blues Klan</li>\r\n<li>Tango Jazz Band</li>\r\n<li>Nová doba</li>\r\n<li>K+R</li>\r\n</ul>', 81, 0, 0, 0, 'https://www.facebook.com/events/652248208202945/'),
(0, 177, '2014-07-12 20:00:00', 'Svatba - soukromá akce', 85, 0, 0, 1, ''),
(0, 178, '2014-09-05 20:00:00', '', 86, 0, 0, 0, 'https://www.facebook.com/events/1470424683220198/'),
(0, 179, '2014-09-26 20:00:00', '+ Kočku do kotle', 87, 0, 0, 0, 'https://www.facebook.com/events/793978633958216'),
(1, 185, '2015-02-07 20:00:00', '<ul>\r\n    <li><a href=\"http://www.rezatyrakety.cz/\">Rezatý Rakety</a></li>\r\n    <li><a href=\"http://bandzone.cz/zooya\">Zo-o-ya</a></li>\r\n    <li><a href=\"http://bandzone.cz/oni\">Oni</a> </li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1596714317229312/1596714720562605'),
(1, 186, '2015-03-14 20:00:00', '<ul>\r\n    <li>Libý Květoň</li>\r\n    <li>Pan Cicvárek, ovčí člověk</li>\r\n    <li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1539827149598869/?ref=5'),
(1, 195, '2015-04-04 20:00:00', '<ul>\r\n    <li>Strašidelný elektrik band</li>\r\n    <li>Stoker One Man Band</li>\r\n    <li>Rezatý Rakety</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/1571163939785981/'),
(1, 189, '2015-06-06 20:00:00', '<ul>\r\n	<li>Chuť</li>\r\n	<li>Rezatý Rakety</li>\r\n	<li>Kočku do kotle</li>\r\n</ul>', 38, 0, 0, 0, 'https://www.facebook.com/events/378407462342020/?ref=5'),
(0, 192, '2015-06-13 20:00:00', '<ul><li>Pororoca</li></ul>', 88, 0, 0, 0, ''),
(0, 193, '2015-05-16 20:00:00', 'Pouť', 83, 0, 0, 0, ''),
(0, 194, '2015-06-05 20:00:00', '', 89, 0, 0, 0, ''),
(0, 196, '2015-05-16 16:00:00', 'Velmi KO', 48, 0, 0, 0, ''),
(0, 197, '2015-07-11 15:00:00', 'Festival <b>Máme maso, přilož kytarou</b>', 90, 0, 0, 0, ''),
(0, 198, '2015-07-01 15:30:00', '<b>25. výročí FAV</b>', 91, 0, 0, 0, ''),
(0, 199, '2015-07-15 20:00:00', '<ul><li>Kočku do kotle</li></ul>', 92, 0, 0, 0, ''),
(0, 200, '2016-05-28 20:00:00', '<ul><li>Blue Zebra</li><li>Hostee</li></ul>', 73, 0, 0, 0, 'https://www.facebook.com/events/1571763386450042/'),
(0, 201, '2016-07-16 19:00:00', '', 93, 0, 0, 0, ''),
(0, 202, '2016-09-03 20:00:00', '<ul>\r\n<li>Kočku do kotle</li>\r\n</ul>', 94, 1, 0, 0, ''),
(0, 203, '2016-09-23 20:00:00', '<ul>\r\n<li>Paheyl</li>\r\n<li>Way to</li>\r\n<li>Laik</li>\r\n</ul>', 95, 0, 0, 0, ''),
(0, 204, '2016-10-07 20:00:00', '<ul>\r\n<li>Kočku do kotle</li>\r\n</ul>', 87, 0, 0, 0, 'https://www.facebook.com/events/567837580078898/?active_tab=posts'),
(0, 205, '2017-06-24 17:00:00', 'Festival <b>Máme maso, přilož kytarou</b>', 90, 1, 0, 0, ''),
(0, 206, '2017-03-24 20:00:00', '', 96, 0, 0, 0, ''),
(0, 207, '2018-06-23 17:15:00', '', 97, 0, 0, 0, ''),
(0, 208, '2018-05-26 15:00:00', '', 98, 0, 0, 0, ''),
(0, 209, '2018-12-07 20:00:00', '<ul><li>Katana</li><li>Flaxa</li><li>Tender Fury</li><li>Zlo z Jihu</li><li>Hostee</li><li>Until the End</li><li>Ženeveš</li><ul>', 99, 0, 0, 0, 'https://www.facebook.com/events/517645522083722/'),
(0, 210, '2019-04-13 20:00:00', 'Barcamp after party', 100, 0, 0, 0, ''),
(0, 211, '2019-11-16 20:00:00', '', 96, 0, 0, 0, ''),
(0, 212, '2019-07-21 20:00:00', '', 101, 1, 0, 0, ''),
(0, 213, '2019-10-09 20:00:00', '', 102, 0, 0, 0, ''),
(0, 214, '2021-06-12 17:00:00', 'Festival odpadních vod', 103, 0, 0, 0, ''),
(0, 215, '2021-08-24 18:15:00', 'Festival na ulici', 104, 0, 0, 0, ''),
(0, 216, '2021-07-05 20:00:00', '+ Hudba Praha', 105, 0, 0, 0, 'https://www.facebook.com/events/543627673321956/?ref=newsfeed'),
(0, 217, '2021-09-11 20:00:00', '', 106, 0, 0, 0, ''),
(0, 218, '2021-08-14 20:00:00', '', 107, 0, 0, 0, ''),
(0, 219, '2021-10-02 20:00:00', '', 108, 0, 0, 0, ''),
(0, 220, '2022-03-19 20:00:00', '', 109, 0, 0, 0, ''),
(0, 221, '2022-05-13 20:00:00', '', 103, 0, 0, 0, ''),
(0, 222, '2022-07-02 20:00:00', '', 105, 0, 0, 0, ''),
(0, 223, '2022-08-21 16:45:00', 'Festival Na Ulici', 110, 0, 0, 0, ''),
(0, 226, '2023-04-01 20:00:00', '', 96, 0, 0, 0, ''),
(0, 227, '2023-06-17 20:00:00', 'Slavnosti sedřené kůže', 96, 0, 0, 0, ''),
(0, 228, '2023-01-21 20:00:00', '', 111, 0, 0, 0, ''),
(0, 229, '2023-02-11 20:00:00', '+ Hi-Fly', 112, 0, 0, 0, ''),
(0, 230, '2023-03-10 20:00:00', '', 113, 0, 0, 0, ''),
(0, 231, '2023-05-13 20:00:00', 'Festival odpadních vod', 103, 0, 0, 0, ''),
(0, 232, '2023-05-20 20:00:00', '', 114, 0, 0, 0, ''),
(0, 233, '2023-07-15 20:00:00', '', 115, 0, 0, 0, ''),
(0, 234, '2023-10-28 20:00:00', '', 96, 0, 0, 0, ''),
(0, 235, '2023-08-21 16:45:00', 'Festival na ulici', 110, 0, 0, 0, '');

-- --------------------------------------------------------



CREATE VIEW view_koncerty AS
select `koncerty`.`fblink` AS `fblink`,`koncerty`.`trojkazblues_flag` AS `trojkazblues_flag`,`koncerty`.`id` AS `id`,`koncerty`.`poznamka` AS `poznamka`,`koncerty`.`soukromaAkce_flag` AS `soukromaAkce_flag`,`kluby`.`jmeno` AS `jmeno`,`kluby`.`adresaUlice` AS `adresaUlice`,`kluby`.`adresaMesto` AS `adresaMesto`,`kluby`.`WWW` AS `WWW`,`kluby`.`linkMapa` AS `linkMapa`,unix_timestamp(`koncerty`.`datum`) AS `date`,`koncerty`.`datum` AS `datum` from (`koncerty` join `kluby` on((`koncerty`.`klub_id` = `kluby`.`id`))) where ((`koncerty`.`zruseno_flag` = 0) and (year(`koncerty`.`datum`) > 2007)) order by `koncerty`.`datum` desc
