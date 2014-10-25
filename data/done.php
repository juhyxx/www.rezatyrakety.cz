<?php
    require_once('settings.php');

	$output = array(
	    'jsonrpc' => "2.0",
	    'result' => array()
	);

	$connection = mysql_pconnect(Settings::MYSQL_HOST, Settings::MYSQL_USER, Settings::MYSQL_PASSWORD) or 'can\'t connect';
	$database = Settings::MY_DATABASE;

	mysql_select_db($database) or 'can\'t connect';

	mysql_query("SET CHARACTER SET utf8");

	$result = mysql_query("SELECT * FROM view_koncerty WHERE datum < now() ORDER BY datum DESC");
	
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	    array_push($output['result'], $row);
	}

	echo json_encode($output);
?>