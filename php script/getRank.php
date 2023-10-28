<?php
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
        $score = $conn->prepare("   SELECT * 
                                    FROM scoreboard S
                                    WHERE S.score IN (
                                        SELECT MAX(S1.score) AS BestScore
                                        FROM scoreboard S1
                                        WHERE S1.username <>'admin' AND S1.username = S.username
                                        GROUP BY S1.username)
                                    ORDER BY score DESC
        ");
        $score->execute();
        $personalscore="";
        if (isset($_COOKIE["username"]))
        {
            $personalscore = $conn->prepare("SELECT MAX(score) as score FROM scoreboard where username = ?");
            $personalscore->bindValue(1,$_COOKIE["username"]);
            $personalscore->execute();
            $personalscore = $personalscore->fetch();
        }
        
        //Compongo la tabella
        $scoreboard ="<thead><tr><th>Rank</th><th>Utente</th><th>Punteggio</th><th>Data</th></tr></thead><tbody>";
        $pos=1;
        $setted = false;
        while($row = $score->fetch()) //seleziono una riga per volta
        {
            if (isset($_COOKIE["username"])) // Se un giocatore è connesso, evidenzio la sua posizione in classifica
            {
                if($personalscore["score"] == $row["score"] && $_COOKIE["username"] == $row["username"] && $setted == false)
                {
                    $scoreboard = $scoreboard."<tr style='background-color: green'>";
                    $setted =true;
                }
                    
            }
            else
            {
                $scoreboard = $scoreboard."<tr >";
            }
            $scoreboard = $scoreboard."<td >".$pos."</td>
                                       <td>".$row["username"]."</td>
                                       <td>".$row["score"]."</td>
                                       <td>".$row["data"]."</td></tr>";
            $pos++; 
        }
        $scoreboard = $scoreboard."</tbody>";
        } catch(PDOException $e) {
            printf ("Error: ". $e->getMessage());
        }
    
        $conn = null;
?>