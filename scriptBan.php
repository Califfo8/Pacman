<?php

    if(!empty($_POST['banID'][1]))
    {
        $action = 0;
        if($_POST['banID'][1] == 'BAN')
			$action = 1;
        //Variabili per la connessione al database
        $connectionstring = "mysql:host=localhost;dbname=califano_616510";
        $username = "root";
        $pass = "";
        try {
        //Mi connetto al database
        $conn = new PDO($connectionstring, $username, $pass);

        // Metto la modalità di errore di PDO exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = "update users set ban = ? where username = ?;";
        $retrieveResults = $conn->prepare($query);
		$retrieveResults->bindValue(1,$action);
		$retrieveResults->bindValue(2,$_POST['banID'][0]);
		$retrieveResults->execute();
        
    
        } catch(PDOException $e) {
            printf ("Error: ". $e->getMessage());
        }
    }
    header('Location: areaPersonale.php');
?>