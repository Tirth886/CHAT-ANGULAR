<?php 
	session_start();
	/* 
		Access-Control-Allow-Origin is use when there is a situation were there is communication between same server but different port number
	*/

	header('Access-Control-Allow-Origin: *');
	// header('Content-Type: application/json');
	
	include_once("connection.php");
	
	/* 
		Register Module
	*/

	if($_POST['action']=="register"){
		// print_r($_POST);
		$name 	  = $_POST['username'];
		$email	  = $_POST['email'];
		$password = $_POST['password'];
		
		$response = [];
		if(($name == "undefined" || $name == "") || ($email == "undefined" || $email == "") || ($password == "undefined" || $password == "")){
			if($name == "undefined" || $name == ""){
				$response['err']['nerr'] = "Name Required";
			}else{}
			if($email == "undefined" || $email == ""){
				$response['err']['eerr'] = "Email Required";
			}else{}
			if($password == "undefined" || $password == ""){
				$response['err']['perr'] = "Password Required";
			}else{}
		}else{
			if($email){
				$isEmailexist = "SELECT `email` FROM `user` WHERE `email`='$email'";
				$exe = $con->query($isEmailexist);
				$record = $exe->fetch_object();
				if(@count($record)===1){
					$response['isExist'] = "Email already Exist";
				}else{
					$newRec = "INSERT INTO `user` (`name`,`email`,`passkey`) VALUES ('$name','$email','$password')";
					$exe = $con->query($newRec);
					if($exe){
						$response['status'] = "Insert Sucessfully"; 
						$response['value'] = true;
					}else{
						$response['failure'] = "Something Went Worng";
						$response['value'] = false;
					}
				}
			}else{}
		}
		print_r(json_encode($response));
	}

	/* 
		Login Module
	*/

	else if($_POST['action']=="login"){
		// print_r($_POST);
		$email    = $_POST['email'];
		$password = $_POST['password'];

		$response = [];
		if (( $email=="undefined" || $email=="" ) && ( $password=="undefined" || $password=="" )){
			
			if (( $email=="undefined" || $email=="" )){
				$response['err']['eerr'] = "Email Required";
			}else{}
			if ( ( $password=="undefined" || $password=="" ) ){
				$response['err']['perr'] = "Password Required";
			}else{}

		}else{
			$isEmail = "SELECT * FROM `user` WHERE `email` = '$email' AND `passkey` = '$password'";
			$exe = $con->query($isEmail);
			$user = $exe->fetch_object();
			if( @count($user)===1 ){
				
				$_SESSION['userstatus'] = true;
				$_SESSION['id'] = $user->id;
				$_SESSION['name'] = $user->name;
				$_SESSION['email'] = $user->email;
				$_SESSION['password'] = $user->passkey;
				
				// print_r($_SESSION);
				/* 
					Setting Up value in Response[]		
				*/

				$response['value']    = true;
				$response['user'] 	  = $_SESSION['name'];
				$response['id'] 	  = $_SESSION['id'];
				$response['email'] 	  = $_SESSION['email'];
				$response['password'] = $_SESSION['password'];

			}else{
				$response['value'] = false;
				$response['invalid'] = "Invalid user";
			}
		}

		// print_r($_SESSION);
		print_r(json_encode($response));
	}

	/*
		User Friend
	*/

	else if ($_POST['action']=="friendlist") {
		$id = $_POST['userId'];
		$result = [];

		$friends = "SELECT `id`,`name`,`email` FROM `user` WHERE `id`!='$id'";
		$field = $con->query($friends);
		// print_r(json_encode($field->num_rows));
		$count = 1;
		if($field->num_rows > 0){
			while ($frendlist = $field->fetch_object()) {
				$friendid   = $frendlist->id;
				$friendname = $frendlist->name;
				$friendemail= $frendlist->email;

				$myFriends[] = array (
					'friendid' 	  => $friendid,
					'friendname'  => $count.")"."  ".$friendname,
					'friendemail' => $friendemail
				);
				$count++;
			}

			$myFriends  = @$myFriends;
			$totalfrend = $field->num_rows;
			$response   = true;
			$message    = "";
		}else{
			$myFriends  = array();
			$totalfrend = 0;
			$response   = false;
			$message    = "No Friend Yet";
		}

		$result['myFriends']  = $myFriends;
		$result['totalfrend'] = $totalfrend;
		$result['response']   = $response;
		$result['message']    = $message;

		print_r(json_encode($result));
	}	

	/*
		Sending Message Module
	*/

	else if ($_POST['action']=="send") {
		$toid   = $_POST['fid'];
		$toname = $_POST['fname'];
		$fromid = $_POST['fromid'];
		$message = trim($_POST['message']);
		$response = [];

		if($message=="undefined" || $message==""){
			$response['err']['merr'] = "Required";
		}else{
			$insert = "INSERT INTO `chat message` (`toid`,`fromid`,`message`) VALUES ('$toid','$fromid','$message')";
			$exe = $con->query($insert);
			if($exe){
				$response['status'] = true;
			}else{
				$response['status'] = false;
			}
		}
		print_r(json_encode($response));
	}

	/*
		Sending Message to Friend Module
	*/

	else if ($_POST['action']=="sendmsg") {
		$fromid = $_POST['fromid'];	
		$toid = $_POST['toid'];	
		$result = [];
		// print_r(json_encode($fromid."+".$toid));
		$sendquery = "SELECT * FROM `chat message` WHERE (`fromid` = '$fromid' AND `toid` = '$toid') OR (`fromid` = '$toid' AND `toid` = '$fromid')";
		$exe = $con->query($sendquery);
		if($exe->num_rows > 0){
			while ($sendmsg = $exe->fetch_object()) {
				$mymessage = $sendmsg->message;
				$time = $sendmsg->timestamp;
				if($sendmsg->fromid == $fromid){
					$imessage [] = array(
						'mymessage' => $mymessage,
						'timestamp' => $time,
						'myisStatus'=> true 					
					);
				}else{
					$imessage [] = array(
						'remessage'  => $mymessage,
						'rtimestamp' => $time,
						'risStatus'  => true
					);
				}
			}
			$mymessage = @$imessage;
			$isSucess  = true;
			$status   = "";
		}else{
			$mymessage = @array();
			$isSucess  = false;
			$status   = "No conversation yet!";
		}

		$result['mymessage'] = $mymessage;
		$result['isSucess']  = $isSucess;
		$result['status']    = $status;
		print_r(json_encode($result));
	}

	/* 
		Logout Module
	*/

	else if($_POST['action']=="logout"){
		unset($_SESSION['userstatus']);
		unset($_SESSION['id']);
		unset($_SESSION['name']);
		unset($_SESSION['email']);
		unset($_SESSION['password']);
		$response['logoutStatus'] = true;
		print_r(json_encode($response));
	}
?>