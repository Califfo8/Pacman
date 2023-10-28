<?php
//Salvo nei cookie le impostazioni dell'utente
    if(!empty($_POST["effettiV"]))
    {
		$volumeEffetti = $_POST["effettiV"];
		setcookie("effettiV",$volumeEffetti,time()+86400);
	}

	if(!empty($_POST["musicaV"]))
    {
		$volumeMusica = $_POST["musicaV"];
		setcookie("musicaV",$volumeMusica,time()+86400);
	}
//verifico se sono presenti dei cookie altrimenti pongo a dei valori di defaulr
	if(!empty($_COOKIE["effettiV"]))
		$effetti = $_COOKIE["effettiV"];
    else
        $effetti = 0;
    
	if(!empty($_COOKIE["musicaV"]))
		$musica = $_COOKIE["musicaV"];
    else 
        $musica = 0;

	printf(json_encode($effetti ."|". $musica));










?>