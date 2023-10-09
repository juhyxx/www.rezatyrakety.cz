<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    require_once('settings.php');

	$output = array(
	    'jsonrpc' => "2.0",
	    'result' => array(
			'koncerts' => array(),
			'oldkoncerts-count' => 0,
		)
	);

	$connection = mysql_pconnect(Settings::MYSQL_HOST, Settings::MYSQL_USER, Settings::MYSQL_PASSWORD) or 'can\'t connect';
	$database = Settings::MY_DATABASE;

	mysql_select_db($database) or 'can\'t connect';

	mysql_query("SET CHARACTER SET utf8");


	$result = mysql_query("SELECT * FROM view_koncerty WHERE datum >= now() ORDER BY datum ASC LIMIT 0 , 10");

	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	    array_push($output['result']['koncerts'], $row);
	}

	$result = mysql_query("SELECT count(*) as count FROM view_koncerty WHERE datum < now()");

	if ($row = mysql_fetch_object($result)) {
	    $output['result']['oldkoncerts-count'] = $row->count;
	}
	echo json_encode($output);
?>
