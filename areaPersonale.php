<?php
	include './php script/getPersonalScore.php';
	include "./php script/getFavicon.php"; 
?>
<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="UTF-8" >
		<meta name="viewport" content="width=device-width" >

		<title>Area Personale</title>

		<link rel="stylesheet" href="./styles/global.css" type="text/css">
		<link rel="stylesheet" href="./styles/Personal&Rank.css" type="text/css">
		<link rel="stylesheet" href="./styles/slide.css" type="text/css">
		<?php
            printf($faviconstring);      
        ?>
	</head>

	<body>
	<form action="index.php">
		<input type="submit" value="MAIN MENU">
	</form>
	<form action="logout.php" method="post" accept-charset="utf-8">
		<input type="submit" value="LOG OUT" name="logOut" >
	</form>
	
	<?php
		printf("<h1>Bentornato ". $_COOKIE["username"] ."</h1>");
	?>
	<table>
		<?php
			printf($scoreboard);
		?>
	</table>
	
	</body>
</html>