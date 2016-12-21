<?php
try{	
	$event_id = $_REQUEST['event_id'];
	$db = new PDO('sqlite:eventsdb.sqlite');	
	$db->exec("DELETE FROM events WHERE event_id='$event_id'");
	
	
}catch(PDOException $e){
	echo("Ei ok!" . $e);
}
$db=null;
?> 