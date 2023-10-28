
function showOptions(how)
{
    Obox = document.getElementById("optionsBox");
    if(how == true)
    {
        Obox.style.visibility = "visible";
    }else{
        Obox.style.visibility = "hidden";
    }
}

//funzione che mi imposta il volume della musica al caricamento della pagina
window.addEventListener("load", setVolume);
function setVolume()
{
    //Imposto gli eventi per le opzioni
    document.getElementById("musicVolume").addEventListener("change",changeMusicV);
    document.getElementById("effectVolume").addEventListener("change",changeEffectV);
    //Imposto i valori dell'utente se ci sono
    fetch("./php script/favouriteOptions.php")
	.then(response=>response.json())
	.then(data =>{
		let musicVolume = data.split("|")[1];
        let effectVolume = data.split("|")[0];

		document.getElementById("Music").volume = musicVolume/100;
		document.getElementById("musicVolume").value = musicVolume;

		document.getElementById("effectVolume").value = effectVolume;
	});

}

// funzione cha cambia il volume della musica
function changeMusicV(){
    let audio = document.getElementById("Music");
    let control = document.getElementById("musicVolume");

    //imposto l'audio
    audio.volume = control.value /100;
    //invio le impostazioni
    let sendValue = new FormData();
	sendValue.append("musicaV", control.value);
	fetch("./php script/favouriteOptions.php",{method: "POST", body: sendValue})
	.then(data=>data);

    
}

// funzione cha cambia il volume degli effetti sonori
function changeEffectV(){
    let control = document.getElementById("effectVolume");
    //invio le impostazioni
    let sendValue = new FormData();
	sendValue.append("effettiV", control.value);
	fetch("./php script/favouriteOptions.php",{method: "POST", body: sendValue})
	.then(data=>data);
}