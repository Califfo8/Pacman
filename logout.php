<?php
	if(isset($_POST['logOut']))
    {
		if (isset($_COOKIE['username'])) {
			unset($_COOKIE['username']); 
			setcookie('username', "", time()-3600);
            
		}
		if (isset($_COOKIE['password'])) {
			unset($_COOKIE['password']); 
			setcookie('password', "", time()-3600); 
		}
		header("Location: index.php");
	}
?>
