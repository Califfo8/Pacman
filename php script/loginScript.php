<?php
include "./php script/funzioni.php";
function login($name, $password){
    //Variabili per la connessione al database
    $connectionstring = "mysql:host=localhost;dbname=califano_616510";
    $username = "root";
    $pass = "";

    try {
    //Mi connetto al database
    $conn = new PDO($connectionstring, $username, $pass);

    // Metto la modalità di errore di PDO exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Recupero i dati dal database
    $passcheck = $conn->prepare("SELECT password, ban FROM users WHERE username = ?");
    $passcheck->bindValue(1,$name);
    $passcheck->execute();
    //prelevo la riga risultante
    $result = $passcheck->fetch();

    // Verifico l'utente
    if(empty($result["password"]))
    {
        printf("<h3>Utente non registrato </h3>");
    }else if ($result["ban"] == true)
    {
        printf("<h3>Questo account e' stato sospeso </h3>");
    }else if(password_verify($password,$result["password"]))
    {
        //Se la password è corretta imposto i cookie per un giorno
        setcookie("username", $name, time()+86400);
		setcookie("password", $result["password"], time()+86400);
        header("Location: index.php");
    }else{
        printf("<h3>Password errata</h3>");
    }    

    } catch(PDOException $e) {
        printf ("Error: ". $e->getMessage());
    }

    $conn = null;
    }


    // Controllo se sono stati inviati dei valori
    if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['loginButton']) ){ 
        $user = test_input($_POST["name"]);
        $user = strtolower($user); // il carattere adottato non tiene conto delle maiuscole, ma il server si, per questo le rimuovo
        $password = test_input($_POST["pass"]);

        if(!empty($user) && !empty($password))
        {
            login($user, $password);
        }else
        {
            printf ("<h3>Riempi tutti i campi!</h3>");  
        }
        
    }
?>