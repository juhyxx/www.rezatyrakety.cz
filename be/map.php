<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    require_once('settings.php');

    $output = array();

    $mysqli =  new mysqli(Settings::MYSQL_HOST, Settings::MYSQL_USER, Settings::MYSQL_PASSWORD, Settings::MY_DATABASE);
	if ($mysqli->connect_error) {
		die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
	}
	$mysqli->query("SET CHARACTER SET utf8");
	$result = $mysqli->query("SELECT 
		COUNT(koncerty.datum) as count, 
		MAX(jmeno) as jmeno,
		MAX(festival) as festival,
		MAX(linkMapa) as linkMapa,
		MAX(adresaMesto) as adresaMesto,
		MAX(adresaUlice) as adresaUlice,MAX(WWW) as WWW, 
		MAX(note) as note,
		max(datum) as datum,
		max(status) as status,
		(CASE WHEN MAX(datum) < DATE_SUB(CURDATE(), INTERVAL 10 YEAR) THEN 1 ELSE 0 END) as is_old,
		(CASE WHEN MAX(datum) > CURDATE() THEN 1 ELSE 0 END) as is_current
		FROM kluby 
		LEFT OUTER JOIN koncerty
		ON kluby.id=koncerty.klub_id 
		WHERE linkMapa is not null
		GROUP BY kluby.id;
	");
	while($row = $result->fetch_array(MYSQLI_ASSOC)) {
		array_push($output, $row);
	}

    echo json_encode($output);
	$mysqli->close();