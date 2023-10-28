<?php
	include "./php script/getFavicon.php"; 
?>
<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">

		<title>Login Screen</title>

		<link rel="stylesheet" href="./styles/global.css" type="text/css">
        <link rel="stylesheet" href="./styles/accessStyle.css" type="text/css">
		<link rel="stylesheet" href="./styles/login.css" type="text/css">
        <?php
            printf($faviconstring);      
        ?>

        <script src="./script/redirect.js"></script>
	</head>
	<body>
    <div id = "sx">
    <button type="button" onclick = "MainMenu()">Menu</button>
    
    </div>
    
    <div id = "ce">
        
        <div id = "FormBox">
            <form  method="post">
                <table>
                    <tr>
                        <td>Name:</td>      <td><input type="text" name="name" id = "nome"></td>
                    </tr>
                    <tr>
                        <td>Password:</td>  <td><input type="password" name="pass" id = "pass"></td>
                    </tr>
                </table>
                <div> <input type="submit" name = "loginButton" id ="loginButton" value = "Login"> </div>
                
                
            </form>
            
        </div>
        
    </div>
    <div id ="Dx">
            Non sei registrato?<br>
            <div><button type="button" onclick = "register()">Registrati Ora</button></div>
        <div id ="DxInf">
            <?php
            include './php script/loginScript.php';
            ?>
        </div>
    </div>
    
    </body>
</html>