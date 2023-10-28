<?php
function saveScore($score){
    //Variabili per la connessione al database
    $connectionstring = "mysql:host=localhost;dbname=califano_616510";
    $username = "root";
    $pass = "";
    //variabili utente
    $utente = $_COOKIE["username"];
    try {
    //Mi connetto al database
    $conn = new PDO($connectionstring, $username, $pass);
    $password = password_hash($password, PASSWORD_BCRYPT);

    // Metto la modalità di errore di PDO exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Inserisco il punteggio nella classifica
    $newscore = $conn->prepare("INSERT INTO scoreboard (username, score, data)
                                VALUES (?, ?, current_timestamp());");
    $newscore->bindValue(1,$utente);
    $newscore->bindValue(2,$score);
    $newscore->execute();

    } catch(PDOException $e) {
        printf ("Error: ". $e->getMessage());
    }

    $conn = null;
    
    }


    // Controllo se sono stati inviati dei valori
    if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST["score"]) ){ 
        if(isset($_COOKIE["username"]) && $_COOKIE["username"] != "admin")
            saveScore($_POST["score"]);
        else if($_COOKIE["username"] == "admin")
            header('Location: classifica.php');
        else
            error("Violazione Integrità: Utente non registrato");
    }
    header('Location: classifica.php');
?>