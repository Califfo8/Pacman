<?php
        function banText($ban){
            if($ban == 1)
                return "BANNED";
            else
                return "FREE";
        }

        function insertSwitch($name,$ban)
        {
            $switch = 
            "<form action='scriptBan.php' method='post' accept-charset='utf-8'>
			    <input hidden name='banID[]' value='".$name."' />
                <input type='submit' value='".(($ban == 1)?'UNBAN':'BAN') . "' name='banID[]'/>
            </form>";
            return $switch;
        }

        //Variabili per la connessione al database
        $connectionstring = "mysql:host=localhost;dbname=califano_616510";
        $username = "root";
        $pass = "";
        $name = $_COOKIE["username"];
        try {
        //Mi connetto al database
        $conn = new PDO($connectionstring, $username, $pass);
    
        // Metto la modalità di errore di PDO exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        if($_COOKIE["username"] != "admin") // Nel caso vi sia un giocatore normale genero la tabella dei punteggi personali
        {
            //Recupero i dati dal database
            $score = $conn->prepare("SELECT * FROM scoreboard WHERE username = ? ORDER BY score DESC");
            $score->bindValue(1,$name);
            $score->execute();

            //Compongo la tabella
            $scoreboard ="<thead><tr><th>Utente</th><th>Punteggio</th><th>Data</th></tr></thead><tbody>";
            
            while($row = $score->fetch()) //seleziono una riga per volta
            {
                $scoreboard = $scoreboard."<tr> <td>".$row["username"]."</td>
                                                <td>".$row["score"]."</td>
                                                <td>".$row["data"]."</td></tr>"; 
            }
            $scoreboard = $scoreboard."</tbody>";
        } else { // altrimenti genero la tabella per il ban
            //Recupero i dati dal database
            $users = $conn->prepare("SELECT * FROM users WHERE username !='admin'");
            $users->execute();

            //Compongo la tabella
            $scoreboard ="<thead><tr><th>Utente</th><th>Status</th><th>Action</th></tr></thead><tbody>";
            
            while($row = $users->fetch()) //seleziono una riga per volta
            {
                $scoreboard = $scoreboard."<tr> <td>".$row["username"]."</td>
                                                <td>".banText($row["ban"])."</td>
                                                <td>".insertSwitch($row["username"],$row["ban"])."</td></tr>"; 
            }
            $scoreboard = $scoreboard."</tbody>";
        }
        
        } catch(PDOException $e) {
            printf ("Error: ". $e->getMessage());
        }
    
        $conn = null;
?>