<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    require_once('settings.php');

	$output = array(
	    'jsonrpc' => "2.0",
	    'result' => array(
			'koncerts' => array(),
			'oldkoncerts' => array(),
			'oldkoncerts-count' => 0,
		)
	);

	$mysqli =  new mysqli(Settings::MYSQL_HOST, Settings::MYSQL_USER, Settings::MYSQL_PASSWORD, Settings::MY_DATABASE);
	if ($mysqli->connect_error) {
		die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
	}
	$mysqli->query("SET CHARACTER SET utf8");
	$result = $mysqli->query("SELECT * FROM view_koncerty WHERE datum >= now() ORDER BY datum ASC LIMIT 0 , 10");
	while($row = $result->fetch_array(MYSQLI_ASSOC)) {
		array_push($output['result']['koncerts'], $row);
	}

	$result = $mysqli->query("SELECT count(*) as count FROM view_koncerty WHERE datum < now()");
	if ($row = $result->fetch_array(MYSQLI_ASSOC)) {

	    $output['result']['oldkoncerts-count'] = $row["count"];
	}

	$result = $mysqli->query("SELECT * FROM view_koncerty WHERE datum < now() ORDER BY datum DESC limit 100");
	while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	    array_push($output['result']['oldkoncerts'], $row);
	}

	echo json_encode($output);
	$mysqli->close();
?>
