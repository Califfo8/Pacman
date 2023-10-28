<?php
include "./php script/funzioni.php";
function register($name, $password){
    //Variabili per la connessione al database
    $connectionstring = "mysql:host=localhost;dbname=califano_616510";
    $username = "root";
    $pass = "";

    try {
    //Mi connetto al database
    $conn = new PDO($connectionstring, $username, $pass);
    $password = password_hash($password, PASSWORD_BCRYPT);

    // Metto la modalità di errore di PDO exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Controllo se l'utente è già presente
    $usercheck = $conn->prepare("SELECT count(*) as quanti FROM users WHERE username = ?");
    $usercheck->bindValue(1,$name);
    $usercheck->execute();
    //prelevo la riga risultante
    $result = $usercheck->fetch();
    //Seleziono il valore interessato
    $numUser = $result['quanti'];
    //Verifico la registrazione
    if($numUser>=1)
    {
        printf ("<h3>Utente gia' registrato</h3>");
    }else
    {
        //Inserisco i valori all'interno del database
        //Creo la query di inserimento
        $query = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $query->bindValue(1,$name);
        $query->bindValue(2,$password);

        //Eseguo la query di inserimento
        $query->execute();

        printf ("<h3 style='color:green'>L'utente e' stato registrato correttamente</h3>");
    }
    

    } catch(PDOException $e) {
        printf ("Error: ". $e->getMessage());
    }

    $conn = null;
    }


    // Controllo se sono stati inviati dei valori
    if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST["registerButton"]) ){ 
        $user = test_input($_POST["name"]);
        $user = strtolower($user); // il carattere adottato non tiene conto delle maiuscole, ma il server si, per questo le rimuovo
        $password = test_input($_POST["pass"]);
        $password2 = test_input($_POST["pass2"]);

        if(!empty($user) && !empty($password) && !empty($password2 ))
        {
            register($user, $password);
        }else
        {
            printf ("<h3>Tutti i valori sono obbligatori</h3>");  
        }
        
    }
?>