<?php
	include "./php script/getFavicon.php"; 
?>

<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">

		<title>Register Screen</title>

		<link rel="stylesheet" href="./styles/global.css" type="text/css">
		<link rel="stylesheet" href="./styles/accessStyle.css" type="text/css">
        <link rel="stylesheet" href="./styles/register.css" type="text/css">
        <?php
            printf($faviconstring);      
        ?>

        <script src="./script/PassworldCheck.js"></script>
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
                    <tr>
                        <td>Confirm Password:</td> <td><input type="password" onKeyUp="PassCheck()" name="pass2" id = "pass2"></td>
                    </tr>
                </table>
                
                <div> <input disabled type="submit" name = "registerButton" id ="registerButton" value = "Registrati" >  </div>
                
            </form>
            
        </div>
    </div>
    <div id ="Dx">
        <div id ="DxInf">
            <?php
                include './php script/registerScript.php';
                ?>
        </div>
    </div>
    
    </body>
</html>