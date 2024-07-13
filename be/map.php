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
		COUNT(*) as count, 
		MAX(jmeno) as jmeno,
		MAX(linkMapa) as linkMapa,
		MAX(adresaMesto) as adresaMesto,
		MAX(adresaUlice) as adresaUlice,MAX(WWW) as WWW, 
		max(datum) as datum 
		FROM koncerty 
		LEFT JOIN `kluby` 
		ON kluby.id=koncerty.klub_id 
		WHERE kluby.linkMapa is not null AND koncerty.soukromaAkce_flag=0 group by klub_id"
	);
	while($row = $result->fetch_array(MYSQLI_ASSOC)) {
		array_push($output, $row);
	}

    echo json_encode($output);
	$mysqli->close();