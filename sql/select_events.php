<?php
try{	
	$db = new PDO('sqlite:eventsdb.sqlite');	
	$sql  = "SELECT * FROM events ORDER BY time ASC";
	$array = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);	
	echo json_encode($array);
}catch(PDOException $e){
	echo("Ei ok!" . $e);
}
$db=null;
?> 
