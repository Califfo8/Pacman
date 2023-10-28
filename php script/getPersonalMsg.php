<?php
if(isset($_COOKIE["username"]))
{
    $persMsg =" <div id='PerMsg'><h2>Bentornato ".$_COOKIE["username"]."!</h2>
    <button type = 'button' onclick = 'personale()' id = 'personalButton'> Area Personale</button> </div> ";
    $diseplay = "";                
}else {
    $persMsg = "<div id='ButtMsg'>
        <button type = 'button' onclick = 'login()'>Login</button><h2> | </h2>
        <button type = 'button' onclick = 'register()'>Signup</button>
    </div>";
    $diseplay = "disabled";  
}    
?>