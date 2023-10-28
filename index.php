<?php
    include "./php script/getPersonalMsg.php";
    include "./php script/getFavicon.php";        
?>
<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8" >
		<meta name="viewport" content="width=device-width" >

        <title>MainMenu</title>      

        <link rel="stylesheet" href="./styles/MainMenu.css" type="text/css">
        <link rel="stylesheet" href="./styles/global.css" type="text/css">
        <link rel="stylesheet" href="./styles/optionMenu.css" type="text/css">
        <?php
            printf($faviconstring);      
        ?>
        
        <script src="./script/redirect.js"></script>
        <script src="./script/pacman.js"></script>
        <script src="./script/opzioni.js"></script>
    </head>


    <body>
        <div id = "optionsBox">
            <div id = "container">
                <div><button id="close" onclick="showOptions(false)">X</button></div>
                    <h2>Volume Settings</h2>
                    <label for="musicVolume">Musica</label>
                    <input type="range" step="1" min="0" max="100" value="0" id="musicVolume">
                    <label for="effectVolume">Effetti</label>
                    <input type="range" step="1" min="0" max="100" value="100" id="effectVolume">
            </div>
        </div>
        <div id = "sx">
            <h1>Pacman</h1>
            <button type = "button"<?php printf($diseplay); ?> onclick = "play()">Gioca</button>
            <button type = "button" onclick = "classifica()">Classifica</button>
            <button type = "button" onclick="showOptions(true)">Opzioni</button>
            <button type = "button" onclick="docs()">Documentazione</button>
        </div>
        <div id = "dx">
            <?php
                printf($persMsg);
                
            ?>
        </div>
        <iframe src="./sounds/silence.mp3" allow="autoplay" style="display:none" id="Audio">
		</iframe> 
        <audio autoplay loop id="Music">
			<source src="./sounds/Piracle-ElectricCampfire.mp3" type="audio/mpeg">
		</audio>
    </body>
</html>
