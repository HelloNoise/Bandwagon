<?php
if(!empty($_REQUEST["event"])){
	$event = $_REQUEST['event'];
	$venue = $_REQUEST['venue'];
	$city = $_REQUEST['city'];
	$time = $_REQUEST['time'];
	//$rekno = str_replace("'","''",$rekno); //O'Brian
	//$rekno = str_replace("<","",$rekno); //Poistetaan tagin aloitus
	$db = new PDO('sqlite:eventsdb.sqlite');
	//Onko tulos jo kannassa?
	$sql  = "SELECT * FROM events WHERE event='$event' AND venue='$venue' AND city='$city' AND time='$time'";
	$result = $db->query($sql);
	if($result->fetch()){
		echo("Tulos on jo kannassa!");
		$result=null;
		$db=null;
	}else{
		//Jos ei ole, niin lisätään
		$db->exec("INSERT INTO events(event, venue, city, time) VALUES('$event','$venue','$city', '$time');");
		$db=null;
		header('Location:index.php') ;
	}
}

?>
