const Codice = {Vuoto:0,NotASpace:1,Pallina:10,Muro:2,Pacman:3, PowerPill:5, Blinky:21,Pinky:22,Inky:23,Clyde:24,Eateble:25,Eated:26};
class GameMap {
  constructor (id,r,c)
  {
    let tab =document.getElementById(id);
    let matrix= new Array(r);
    let stilePerimetro = "solid blue 2px";
      for(let i=0;i<r;i++)
      {
        let tr = document.createElement("tr");
        matrix[i] = new Array(c);
        for(let j=0;j<c;j++)
        {
          let td = document.createElement("td");
          td.id =i+"-"+j;
          matrix[i][j] = Codice.Vuoto;
          //creazione perimetro di gioco
          if(i==0|| j==0 || i==r-1 || j==c-1)
          {
            matrix[i][j] = Codice.Muro;
            if(i==0 && j>0 && j!=c-1) //perimetro alto
            {
              td.style.borderBottom = stilePerimetro;
            } else if(i==r-1 && j>0 && j!=c-1) //perimetro basso
            {
              td.style.borderTop = stilePerimetro;
            } else if(i>0 && j==0 && i!=r-1) //perimetro sx
            {
              td.style.borderRight = stilePerimetro;
            }else if(i>0 && j==c-1 && i!=r-1) //perimetro dx
            {
              td.style.borderLeft = stilePerimetro;
            }
          }
            
          tr.appendChild(td);
        }
        tab.appendChild(tr);
        
      }
  // tag della tabella
  this.tag =tab;
  // matrice contenente le informazioni adibite alla posizioni di pareti, fantasmi e pacman
  this.Info=matrix;
  //valori utili
  this.Nrighe= r;
  this.Ncolonne = c;
  this.pallineRimanenti =0; //indica il numero di palline rimanenti
  this.pallineTotali =0;
  this.PillPresence = true;
  //struttura per gestire i tunnel
  this.Tunnel = {unoTd:[],dueTd:[],unoAttivo:false,dueAttivo:false, inUso:0}
  }
  
  getTd(i,j)
  {
    return document.getElementById(i+"-"+j);
  }
  
  createBlock(coordinate,dimensioni)
  {
    let altezza=dimensioni[0];
    let base = dimensioni[1];
    //controllo i valori di input per sicurezza
    if(altezza + coordinate[0]>this.Nrighe || base + coordinate[1] > this.Ncolonne || altezza<0 || base<0 || coordinate[0]<0 || coordinate[1]<0)
      return console.error("Il blocco esce dalla mappa");
    
    //Creo il blocco
    let td = this.getTd(coordinate[0],coordinate[1]);
    td.rowSpan = altezza;
    td.colSpan = base;
    td.classList.add("muro");
    for(let i=coordinate[0];i<coordinate[0]+altezza;i++)
    {
      for(let j=coordinate[1]; j<coordinate[1]+base;j++)
      {
        this.Info[i][j] = Codice.Muro;
        if(j == coordinate[1] && i== coordinate[0])
          continue;
        let td = this.getTd(i,j);  
        td.remove();
      }
    }
    
  }
  singleTunnel(x,y)
  {
    let td, k=0;
    for (let i=x; i<=x+5;i=i+5) //ciclo per creare i due blocchi del tunnel
    {
      //creo il blocco
      this.createBlock([i,y],[4,4]); 
      td = this.getTd(i,y);
      // cambio stile al blocco per farlo sembrare un tunnel
      td.classList.remove("muro");
      td.classList.add("tunnelP");

      //adatto lo stile a seconda della parete di adiacenza
      if(i>0 && y==1 && i!=this.Nrighe-9) //perimetro sx
      {
        td.style.borderLeft = "solid black 2px";          
      }else if(i>0 && y>1 && i!=this.Nrighe-9) //perimetro dx
      {
        td.style.borderRight = "solid black 2px";
        k=this.Ncolonne-1;
      }
    }
    //parete interna al perimetro
    td =this.getTd(x+4,k);
    let portale = [x+4,k];
    this.Info[x+4][k] = Codice.NotASpace;
    td.style.borderTop = "solid blue 2px";
    td.style.borderBottom = "solid blue 2px";
    //Rimozione Palline e muro del perimetro
    for(let i=y;i<y+4;i++)
    {
      this.Info[x+4][i] = Codice.NotASpace;
    }
    
    //distruzione del perimetro
    for(let i=x;i<x+9;i++)
    {
      td = this.getTd(i,k);
      td.style.borderRight ="";
      td.style.borderLeft ="";
    }
    return portale;
  }

  //Crea due tunnel speculari sulle pareti dx e sinistra
  createTunnel(coordinate)
  {
    // i tunnel possono essere creati solo partendo dalle pareti di sx e dx
    if(coordinate[0]<0 || coordinate[0]>this.Nrighe || coordinate[1]!=0)
    return console.error("Il tunnel non può essere creato in mezzo alla mappa");
    
    //creo i due tunnel
    this.Tunnel.unoTd = this.singleTunnel(coordinate[0],coordinate[1]+1);
    this.Tunnel.dueTd = this.singleTunnel(coordinate[0],coordinate[1]+16);
  }

  createGhostHouse(coordinate)
  {
    for(let i=coordinate[0];i<coordinate[0]+4;i++)
    {
      for(let j=coordinate[1]; j<coordinate[1]+5;j++)
      {
        this.Info[i][j] = Codice.NotASpace;
      }
    }
    this.createBlock([coordinate[0],coordinate[1]],[4,1]);
    this.Info[11][10] = Codice.Muro;
    this.createBlock([coordinate[0],coordinate[1]+4],[4,1]);
    this.createBlock([coordinate[0]+3,coordinate[1]+1],[1,3]);
    this.createBlock([coordinate[0],coordinate[1]+1],[1,1]);
    this.createBlock([coordinate[0],coordinate[1]+3],[1,1]);
  }
  toClassic()
  {
    //Parte superiore----------------
    //Quadrati Superiori
    this.createBlock([2,2],[3,3]);
    this.createBlock([2,6],[3,3]);
    this.createBlock([2,12],[3,3]);
    this.createBlock([2,16],[3,3]);
    //Divisore superiore
    this.createBlock([1,10],[4,1]);
    //Parte media-superiore----------
    this.createBlock([6,2],[2,3]);
    this.createBlock([6,8],[2,5]);
    this.createBlock([6,16],[2,3]);
    //Zona Centrale------------------
    //T sx
    this.createBlock([6,6],[7,1]);
    this.createBlock([9,7],[1,2]);
    //T dx
    this.createBlock([6,14],[7,1]);
    this.createBlock([9,12],[1,2]);
    //Divisore centrale
    this.createBlock([8,10],[2,1]);
    //Casa Fantasmi
    this.createGhostHouse([11,8]);
    //Parte media-inferiore-----------
    this.createBlock([14,6],[4,1]);
    this.createBlock([14,14],[4,1]);
    this.createBlock([16,8],[2,5]);
    this.createBlock([18,10],[2,1]);
    //Parte inferiore-----------------
    //L sx
    this.createBlock([19,2],[1,3]);
    this.createBlock([20,4],[3,1]);
    //L dx
    this.createBlock([19,16],[1,3]);
    this.createBlock([20,16],[3,1]);
    //divisori centrali
    this.createBlock([19,6],[1,3]);
    this.createBlock([19,12],[1,3]);
    //Blocchi laterali
    this.createBlock([21,1],[2,2]);
    this.createBlock([21,18],[2,2]);
    //Martello centrale
    this.createBlock([21,8],[2,5]);
    this.createBlock([23,10],[2,1]);
    //T rovesciata sx
    this.createBlock([24,2],[1,7]);
    this.createBlock([21,6],[3,1]);
    //T rovesciata dx
    this.createBlock([24,12],[1,7]);
    this.createBlock([21,14],[3,1]);
    //creo i Tunnel per l'"effetto Pacman"
    this.createTunnel([9,0]);
  }
  inserisciPallina(i,j)
  {
    let td = this.getTd(i,j);
    td.style.backgroundImage = "url('./images/Pallina.png')";
  }

  rimuoviPallina(i,j)
  {
    let td = this.getTd(i,j);
    td.style.backgroundImage = "";
  }
  
  insertPowerPill(i,j)
  {
    let td = this.getTd(i,j);
    td.style.backgroundImage = "url('./images/PowerPellet.jpg')";
    this.Info[i][j] = Codice.PowerPill;
  }

  Reset()
  {
    //Chiudo la porta della casa in caso stesse per uscire una fantasma
    this.Info[11][10] = Codice.Muro;

    this.pallineTotali = 0;
    this.pallineRimanenti =0;
    //riempimento del campo con le palline
    for(let i=0;i<this.Nrighe;i++)
    {
      for(let j=0; j<this.Ncolonne;j++)
      {
        if(this.Info[i][j] == Codice.Vuoto || this.Info[i][j] == Codice.Pallina || this.Info[i][j] == Codice.PowerPill)
        {
          this.Info[i][j] = Codice.Pallina;
          this.inserisciPallina(i,j);
          this.pallineRimanenti++;
          this.pallineTotali++;
        }
      }
    }
    //Inserimento Power Pill
    if(this.PillPresence)
    {
      this.insertPowerPill(3,1);
      this.insertPowerPill(3,19);
      this.insertPowerPill(20,1);
      this.insertPowerPill(20,19);
    }
    
    
  }

}

class Personaggio {
  constructor(pos,vImg,board,codice, vel,oldv)
  {
    let img = document.createElement("img");
    img.src = vImg[0];

    let td = board.getTd(pos[0],pos[1]);
    td.appendChild(img);
    board.Info[pos[0]][pos[1]] = codice;

    //general
    this.spawnPosition = [pos[0],pos[1]];
    this.pos = pos;           //posizione attuale del personaggio
    this.id = codice;         // il codice identificativo del personaggio, da utilizzare nella matrice Info della mappa
    this.imgTag =img;         // il tag immagine del personaggio, essenzialmente la sua grafica  
    this.myMap=board;         //mappa a cui il personaggio è legato

    //animazioni
    this.vetAnimation = vImg;
    this.velocita = vel;
    this.direzioneM = 0;
    this.oldDirection = 1;
    this.inMovimento = false; // variabile per la mutua esclusione del movimento  
     
    //movimento
    this.pause = false;
    this.interval;
    this.oldvalue = oldv;
  }
  //FUNZIONI DI UTILITA'
  // converte un versore nell'identificativo della direzione
  versTodir(v)
    {
      if(v[0] == -1 && v[1]==0)
        return -1;
      else if(v[0] == 0 && v[1]==-1)
        return 2;
      else if(v[0] == 1 && v[1]==0)
        return 1;
      else if(v[0] == 0 && v[1]==1)
        return -2;
    }
// converte una direzione nelle componenti per la matrice
  dirTovers(dir)
  {  
    switch(dir) {
      case 0:
        return [0,0];
      case -1: //va verso sx
        return[-1,0];
      case 2: //va verso l'alto
        return[0,-1];
      case 1: //va verso dx
        return[1,0];
      case -2: //va verso il basso
        return[0,1];
      default:
        console.error("direzione Inesistente");
      }
    }
  
  //cambia l'animazione della direzione
  changeAnimation()
  {
    let indice = this.direzioneM;
    if(indice == 0 && this.id == Codice.Pacman)
    {
      let direzioneDiStop=this.oldDirection;
      if(direzioneDiStop<0)
        direzioneDiStop+=5;
      
      indice = direzioneDiStop +6;
    }
    if(indice<0)
      indice+=5;
    this.imgTag.src = this.vetAnimation[indice];
    
  }

  deathAnimation()
  {
    this.imgTag.src = this.vetAnimation[5];
    //Cambio da gif a frame fermo per non farla ripetere in loop
    setTimeout(() => {
      this.imgTag.src = this.vetAnimation[6];
    },tempoAnimazioneMorte);
  }
  
  checkWarp()
  {
    //verifico se siamo in una casella di warp
    if(this.pos[0]==this.myMap.Tunnel.unoTd[0] && this.pos[1] == this.myMap.Tunnel.unoTd[1] && this.direzioneM == -1)
    {
      //Nel caso lo fossimo sposto la destinazione all'altra casella
      this.pos[0] = this.myMap.Tunnel.dueTd[0];
      this.pos[1] = this.myMap.Tunnel.dueTd[1];      
      return true;

    } else if(this.pos[0]==this.myMap.Tunnel.dueTd[0] && this.pos[1] == this.myMap.Tunnel.dueTd[1] && this.direzioneM == 1){
      this.pos[0] = this.myMap.Tunnel.unoTd[0];
      this.pos[1] = this.myMap.Tunnel.unoTd[1];
      return true;
    }
    return false;
  }

  //funzione per l'animazione di traslazione
  moveAnimation(funzione = false)
  {
    let [sxdx,updo] = this.dirTovers(this.direzioneM);

    this.inMovimento = true;  //variabile per impedire che si sovrapponghino le animazioni fra di loro
    let td = this.myMap.getTd(this.pos[0],this.pos[1]);
    //sxdx e updo valcono 0,1,-1 a seconda della direzione che deve prendere il personaggio, la variabile spostamento ricava da queste e dall'offset
    // del td in cui deve andare i valori per la transizione
    const spostamento= sxdx*Number(td.offsetWidth) + "px,"+updo*Number(td.offsetWidth)+"px";
    
    //associo i valori del css necessari. La velocita è il tempo della transizione, più è basso più saraà veloce
    this.imgTag.style.transition = "all " + this.velocita+"s"+" linear" ;
    this.imgTag.style.transform = "translate("+spostamento+")";
    
    //setto un timer per la parte finale della funzione esterna alla classe in modo da sincronizzarsi con l'aggiornamento della tabella
    setTimeout(() => {
      //rimuovo la transizione per poterla riassegnare, e quindi farla ripartire
        this.imgTag.style.transform = "";
      //inserisco il personaggio (sposto il tag immagine da un td all'altro)
        td.appendChild(this.imgTag);
      // Aggiornamento del punteggio nel caso il personaggio fosse Pacman
      if(funzione)
        funzione();
      //Aggiornamento Matrice info con il codice del personaggio
      this.myMap.Info[this.pos[0]][this.pos[1]] = this.id;
      //consento l'inizio di un nuovo movimento
        this.inMovimento = false; 
      },this.velocita*1000);    
  }
  
}

class Fantasma extends Personaggio {
  constructor(pos,vImg,board,codice, vel, scatter,mem, oldv,d)
  {
    super(pos,vImg,board,codice, vel,oldv);

    this.brain = this.exitGhostHouse; // conterrà la funzione ATTIVA che stabilisce la direzione da prendere per il fantasma
    this.memory = mem;                // contiene una funzione NON ATTIVA che stabilisce la direzione da prendere per il fantasma
    
    this.scatterTarget=scatter;       // necessario per l'alternanza delle modalità di reazioni dei fantasmi

    //Variabili adibite ad identificare lo stato del fantasma
    this.atHome= true;                //Indica se il fantasma è nella casa o no
    this.frightened = false;          //indica se il fantasma è spaventato o no
    this.ChaseOrScatter = false;      // Indica se il fantasma è in Chase mode(false) o in scatter mode (true);
    this.eated = false;               //indica se il fantasma è stato mangiato
    this.alternata =false;            //Serve per il lampeggio dei fantasmi al termine della Power pill

    this.vdeathanimation =d;          // contiene le animazioni per la morte
    this.oldId = codice;

  }

  //ritorna vero se la strada davanti a se è libera, falso altrimenti
  look(dir)
  {
    let [sxdx,updo] = this.dirTovers(dir);
    //Caso in cuoi non si deve muovere
    if (sxdx == 0 && updo == 0)
      return false;
    //Controllo la direzione
    if(this.myMap.Info[this.pos[0]+updo][this.pos[1]+sxdx] == Codice.Muro)
      return false;     
    return true;
  }
  //implemente le regole generali di movimento dei fantasmi: prima fra tutte non poter tornare indietro
  rule(dir)
  {
    if(dir == -this.direzioneM)
      return false;
    return true;
  }
  //calcola la distanza tra due caselle
  pathLength(Td1,Td2)
  {
    let vettoreDistanza = [Td1[0] - Td2[0],Td1[1] - Td2[1]];
    let distanza = Math.round(Math.sqrt( Math.pow(vettoreDistanza[0],2) + Math.pow(vettoreDistanza[1],2)));
    return distanza;
  }
  //decide la direzione del fantasma basandosi sulla casella target in ingresso
  selectPathByTarget(Target)
  {
    //Calcolo la distanza tra il target ed ogni possibile casella movimento e all'associo alla sua direzione
    let vetDistanze = [
      [this.pathLength(Target,[this.pos[0],this.pos[1]+1]), 1], //dx
      [this.pathLength(Target,[this.pos[0]-1,this.pos[1]]), 2], //up
      [this.pathLength(Target,[this.pos[0]+1,this.pos[1]]), -2], //do
      [this.pathLength(Target,[this.pos[0],this.pos[1]-1]), -1] //sx
    ];
    //Riodino il vettore dalla distanza minore alla maggiore
    vetDistanze.sort(function(a, b){return a[0]-b[0]});

    //Prendo il primo dei percorsi che rispetta la regole
    for(let i=0;i<vetDistanze.length;i++)
    {
      if(this.look(vetDistanze[i][1]) && this.rule(vetDistanze[i][1]))
        {
          this.direzioneM = vetDistanze[i][1];
          return;
        }   
    } 

  }

  lookaround()
  {
    //Prendo soltanto l'asse che non viene percorso dal fantasma, per farlo controllo la direzione
    // Pari : asse y (essenzialmente variazione in riga i)
    // Dispari: asse x (essenzialmente variazione in colonna j)
    if(this.direzioneM%2 != 0) //Sto percorrendo l'asse x, quindi controllo l'asse y: updo
    {
      if(this.myMap.Info[this.pos[0]+1][this.pos[1]]!= Codice.Muro || this.myMap.Info[this.pos[0]-1][this.pos[1]]!= Codice.Muro)
        {
          this.brain();
          return;
        }

      //Caso particolare in cui il fantasma debba rientrare nella casa, gli permetto di vedere il cancello
      if(this.pos[0] == this.myMap.Nrighe-2) //Nel caso sia nel corridoio in fondo non gli faccio controllare, dato che sforerebbe
        return;
      if(this.myMap.Info[this.pos[0]+1][this.pos[1]]== Codice.Muro && this.myMap.Info[this.pos[0]+2][this.pos[1]]== Codice.NotASpace && this.eated && !this.atHome) // Controllo anche atHome in quanto lookaround viene eseguita prima di Brain, e all'interno della casa non voglio fare la verifica
        {
          this.brain();
          return;
        }
    }else if (this.direzioneM%2 == 0){ //Sto percorrendo l'asse y, quindi controllo l'asse x: sxdx
      if(this.myMap.Info[this.pos[0]][this.pos[1]+1]!= Codice.Muro || this.myMap.Info[this.pos[0]][this.pos[1]-1]!= Codice.Muro)
        {
          this.brain();
          return;
        }
    }
  }

  exitGhostHouse()
  {
    const Uscita = [10,9];
    this.myMap.Info[11][10]=Codice.Vuoto;
  
      if(this.pos[0] == Uscita[0] && this.pos[1] == Uscita[1])
      {
        this.myMap.Info[11][10]=Codice.Muro;
        this.brain = this.memory;
        this.atHome = false;
        return;
      }

      //decido che direzione intraprendere
      this.selectPathByTarget(Uscita);
  }

  switchMode()
  {
    //Il fantasma è immune al cambiamento di fase se non è in condizioni "normali"
    if(this.eated || this.frightened || this.atHome)
      return;


    if(!this.ChaseOrScatter)// E' in Chase Mode
    {
      let nuovaMente = function () {this.selectPathByTarget(this.scatterTarget);}; //Passa alla Scatter Mode
      this.brain = nuovaMente;      
      this.ChaseOrScatter = !this.ChaseOrScatter;
    }else{// E' in Scatter Mode
      this.brain = this.memory;//Passa alla Chase mode
      this.ChaseOrScatter = !this.ChaseOrScatter;
    }
  }

  move(func =false)
  {
    //Muta esclusione
    if(this.inMovimento)
      return;
    //Nel caso venisse messo in pausa il gioco
    if(this.pause)
      clearInterval(this.interval);
    
    // variabili
    let [sxdx,updo] = this.dirTovers(this.direzioneM);

    if(!this.frightened && !this.eated)
      this.changeAnimation();
    else if(this.eated)
      this.deathAnimation();
    //La casella in cui era il fantasma riprende il valore che aveva
    this.myMap.Info[this.pos[0]][this.pos[1]] = this.oldvalue;
    //Se il fantasma incontra un muro deve scegliere una nuova direzione
    if(!this.look(this.direzioneM))
    {
      this.brain();
      return;
    }
    
    //Avanzamento di this
    
    //verifico se siamo in una casella di warp
    if(!this.checkWarp())
    {
      //altrimenti avanzo normalmente
      this.pos[0]+=updo;
      this.pos[1]+=sxdx;
    }
    // salvo il valore della casella in cui mi sposterò
    //Nella casella successiva è presente un altro fantasma
    if(this.myMap.Info[this.pos[0]][this.pos[1]]>=Codice.Blinky)
      this.oldvalue = Math.floor(this.myMap.Info[this.pos[0]][this.pos[1]]/100); // Ricavo il valore vecchio
    else
      this.oldvalue = this.myMap.Info[this.pos[0]][this.pos[1]]; //Non è presente un altro fantasma, prendo direttamente il valore
    
    //Inserisco il valore del fantasma, concatenato al vecchio valore nella casella in cui andrò a muovermi
    this.myMap.Info[this.pos[0]][this.pos[1]]= Number(this.id + this.oldvalue*100);
    //faccio partire l'animazione
    this.moveAnimation(func);
    // Vedo se è presente una strada affermativa e nel caso cambio direzione
    this.lookaround();
  }  
  
  Reset()
  {
    //ripristino le variabili per il movimento
    this.direzioneM = 0;
    this.changeAnimation();
    this.inMovimento = false;
    //Nel caso al reset i fantasmi siano in uno stato diverso dal normale, ne resetto la velocità
    if(this.eated)
      this.velocita = this.velocita*2;
    else if(this.frightened)
      this.velocita = this.velocita/2;
    //aggiorno la matrice della mappa per indicare che non è più presente
    this.myMap.Info[this.pos[0]][this.pos[1]] = this.oldvalue;
    this.oldvalue = Codice.NotASpace;
    //Faccio ritornare il fantasma a casa
    this.pos[0] = this.spawnPosition[0];
    this.pos[1] = this.spawnPosition[1];
    let td = this.myMap.getTd(this.pos[0],this.pos[1]);
    td.appendChild(this.imgTag);
    //Inizializzo i valori per farlo uscire
    this.brain = this.exitGhostHouse;
    this.atHome = true;
    //Riazzero le variabili adibite allo stato del fantasma
    this.frightened = false;
    this.ChaseOrScatter = true;
    this.eated = false;
    //Rendo visibile il fantasma
    this.vanish(false);
  }
  //fa scomparire i fantasmi
  vanish(active = true)
  {
    if(active)
    {
      this.imgTag.style.visibility = "hidden";
    }else{
      this.imgTag.style.visibility = "visible";
    }
  }
  //mischia in modo casuale gli elementi di un vettore
  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Prende un elemento a caso del vettore
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // Scambio l'elemento randomico con quello attuale
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  //Intelligenza dei fantasmi quando sono spaventati
  runAway()
  {
    //Inizzalizzo un vettore con tutte le possibili direzioni
    let possibleDir = [-2,-1,1,2];
    //lo mischio casualmente
    this.shuffle(possibleDir);
    //Essendo spaventati i fantasmi decidono a caso la direzione da intraprendere
    for(let i=0;i<4;i++)
    {
      if(this.look(possibleDir[i]) && this.rule(possibleDir[i]))
      {
        this.direzioneM = possibleDir[i];
        return;
      }
    }   
  }

  //Attiva la modalità "spaventato", ovvero quando il fantasma diventa blu
  frightenedMode()
  {
    if(this.frightened || this.eated)
      return;
    //Imposto la grafica da spaventato
    this.imgTag.src = this.vetAnimation[5];
    this.frightened = true;
    this.velocita = this.velocita*2;  //dimezzo la velocità del fantasma
    this.id = Codice.Eateble;
    //imposto l'intelligenza per scappare
    this.brain = this.runAway;
  }
  //disattiva la modalità spaventato
  fearNoMore()
  {
    //Se è stato mangiato lascio finire il processo, se non era spaventato non faccio nulla
    if(this.eated || !this.frightened)
      return;
    //Ripristino la velocità
    this.velocita =this.velocita/2;
    //Inserisco la grafica "normale"
      this.changeAnimation();
      this.frightened = false;
      this.eated = false;
      this.id = this.oldId;
      //imposto l'intelligenza corretta
      this.brain = this.memory;
  }
  //Sovrascrivo la funzione della classe Personaggio
  deathAnimation()
  {
    let indice = this.direzioneM;
    if(indice<0)
      indice+=5;
    this.imgTag.src = this.vdeathanimation[indice];

  }
  
  deathMovementPath()
  {
    if(this.pos[0] == this.spawnPosition[0] && this.pos[1] == this.spawnPosition[1])
    {
      //Chiudo la porta di casa
      this.myMap.Info[11][10]=Codice.Muro;
      //Cambio lo status del fantasma in modo che non possa essere mangiato
      this.eated = false;
      this.frightened = false;
      this.id = this.oldId;
      this.velocita = this.velocita*2;
      //Imposto l'animazione giusta
      this.direzioneM = 0;
      this.changeAnimation();
      //Lo metto in pausa in modo che stia fermo
      let attesa = function () {return;};
      this.brain = attesa; 
      //Imposto un timeout per farlo ripartire
      setTimeout(() => {this.brain = this.exitGhostHouse; },5000);
      return;
    }
    //E' all'entrata della casa
    if(this.pos[0] == 10 && this.pos[1] == 10)
    {
      //Apro la porta
      this.atHome = true;
      this.myMap.Info[11][10]=Codice.Vuoto;
    }
    //Scelgo dove andare per tornare a casa
    this.selectPathByTarget(this.spawnPosition);

  }

  passAway()
  {
    //Ripristino la velocità Iniziale
    this.velocita = this.velocita/2;
    //Aumento la velocità di ritorno
    this.velocita = this.velocita/2;
    //Segnalo che il fantasma è stato mangiato
    this.eated = true;
    this.id = Codice.Eated;
    //Cambio la scelta del movimento
    this.brain = this.deathMovementPath;
  }

  RecoverySwitch()
  {
    if(!this.frightened || this.eated)
      return;
    if(this.alternata)
      this.imgTag.src = this.vetAnimation[5];
    else
      this.imgTag.src = this.vetAnimation[6];
    
    this.alternata = !this.alternata;
  }
}

//-----------------------------------------[VARIABILI GLOBALI]---------------------------------------------//
let Mappa;
let Pacman,Blinky,Pinky,Inky,Clyde;
//ScoreBoard
let Punteggio = 0,
    Level = 1, 
    Vite=3;
let ExtraLife =true; //determina se è possibile ottenere una nuova vita al raggiungimento di 10000 punti

//Varibili Fantasmi-relative 
let fasiLivellof =[7,20,7,20,5,20,5,-1]; 
let Indicefasi = -1;
let SwitchModeTimeouts = [];

let Eatedphantom = 0,
    phantomAtHome = 3;

//Variabili per l'intefaccia di gioco
let startTextInterval,
    GameStarted = false;

// Variabili della PowerPill
let PowerPillRInterval,
    TempoPowerPill =10; // In secondi
//variabili Audio
let PacmanAudio = new Audio("./sounds/Pacman WakaWaka.wav");
let PacmanDeathAudio = new Audio("./sounds/Pac-Man Death.mp3");
let PacmanGhostEatingAudio = new Audio("./sounds/PAC-MAN EatingGhost.mp3");
let HighScoreSound = new Audio("./sounds/HighScore.mp3");
let levelUpSound = new Audio("./sounds/LevelUpSoundEffect.mp3")
//--------------------------------------------[COSTANTI]-------------------------------------------------//
//Struttura contenente i valori iniziali delle variabili globali che cambiano nel gioco da rinizializzare al gameOver
const LvZ = {
  PowerPillTime:10,
  vInizialePers:0.5,//default: 0.5
  fasifantasmi:[7,20,7,20,5,20,5,-1]
};

const tempoAnimazioneMorte = 1320, // In millisecondi
      tempoFineAnimazioni = 2000; // In millisecondi

const InVelocitaMorteF = 0.2, //numero puro
      FreqUpdateMovement = 10; // ogni 10 millisecondi verrà chiamata la funzione movimento

let PacImg = ["./images/Pacman/Stop/Dx.png","./images/Pacman/dxmov.gif","./images/Pacman/upmov.gif","./images/Pacman/dwmov.gif","./images/Pacman/sxmov.gif","./images/Pacman/deathAnimation.gif","./images/Pacman/deathFrame.png",
              "./images/Pacman/Stop/Dx.png","./images/Pacman/Stop/Up.png","./images/Pacman/Stop/Dw.png", "./images/Pacman/Stop/Sx.png"];
let PhantomImg = [
  ["./images/Fantasmi/Red/redUp.gif","./images/Fantasmi/Red/redDx.gif","./images/Fantasmi/Red/redUp.gif","./images/Fantasmi/Red/redDw.gif","./images/Fantasmi/Red/redSx.gif","./images/Fantasmi/Spaventato.gif","./images/Fantasmi/RipresaSpaventato.gif"],
  ["./images/Fantasmi/Pink/pinkUp.gif","./images/Fantasmi/Pink/pinkDx.gif","./images/Fantasmi/Pink/pinkUp.gif","./images/Fantasmi/Pink/pinkDw.gif","./images/Fantasmi/Pink/pinkSx.gif","./images/Fantasmi/Spaventato.gif","./images/Fantasmi/RipresaSpaventato.gif"],
  ["./images/Fantasmi/Blue/blueUp.gif","./images/Fantasmi/Blue/blueDx.gif","./images/Fantasmi/Blue/blueUp.gif","./images/Fantasmi/Blue/blueDw.gif","./images/Fantasmi/Blue/blueSx.gif","./images/Fantasmi/Spaventato.gif","./images/Fantasmi/RipresaSpaventato.gif"],
  ["./images/Fantasmi/Orange/orangeUp.gif","./images/Fantasmi/Orange/orangeDx.gif","./images/Fantasmi/Orange/orangeUp.gif","./images/Fantasmi/Orange/orangeDw.gif","./images/Fantasmi/Orange/orangeSx.gif","./images/Fantasmi/Spaventato.gif","./images/Fantasmi/RipresaSpaventato.gif"]
];
let PhantomDeathimg = ["","./images/Fantasmi/death/deathDx.png","./images/Fantasmi/death/deathUp.png","./images/Fantasmi/death/deathDo.png","./images/Fantasmi/death/deathSx.png"];
// PACMMAN ---------------------------------------------------------------------------------//

function newGameSegment()
{
  //Inserisco la scritta Game Over
  let div = document.getElementById("gameOver");
  div.style.visibility = "visible";

  //Attivo la barra spaziatrice per continuare il restart del gioco
  setTimeout(function() {document.getElementById("sendScore").click();},2000);
}
function newGame()
{
  //ritardo il restart del tempo dell'animazione
  setTimeout(newGameSegment,tempoAnimazioneMorte+1000);
}

function pacmanDeath()
{
  //fermo il gioco
  stop();
  Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] = Codice.Vuoto;
  //attesa che le animazioni finiscano
  setTimeout( function () {
    //1) Faccio sparire tutti i fantasmi
    Blinky.vanish();
    Pinky.vanish();
    Inky.vanish();
    Clyde.vanish();
    PacmanAudio.pause();
    PacmanDeathAudio.volume = document.getElementById("effectVolume").value/100;
    PacmanDeathAudio.play();
    //2)faccio partire l'animazione della morte
    setTimeout(function() {Pacman.deathAnimation();},800);

    //1.5Tolgo una vita
    Vite--;
    if(Vite == 0)
    {
      newGame();
      return;
    }
    document.getElementById("Life").innerText = Vite;
    //3)Ripristino il livello senza rifermare il gioco e senza reinmettere le palline mancanti  
    setTimeout(function() {Restore(false,false);},tempoAnimazioneMorte+900);
  },tempoFineAnimazioni);
}


function startPowerPillTime()
{
  Eatedphantom = 0;
  Pacman.oldvalue = Codice.Vuoto;
  // Quando i fantasmi sono spaventati l'alternanza delle fasi si ferma
  pauseAmbush();
  //Saranno spaventati solo i fantasmi all'esterno della casa
  let phantomOutside = 4-phantomAtHome;
  if(phantomOutside >=1 && !Blinky.eated && !Blinky.frightened)
    Blinky.frightenedMode();
  
  if(phantomOutside >=2 && !Pinky.eated && !Pinky.frightened)
    Pinky.frightenedMode();
  
  if(phantomOutside >=3 && !Inky.eated && !Inky.frightened)
    Inky.frightenedMode(); 

  if(phantomOutside >=4 && !Clyde.eated && !Clyde.frightened)
    Clyde.frightenedMode();
  //imposto la fine dell'effetto della Power Pill
  setTimeout(disablePowerPill,TempoPowerPill * 1000);
  //a 4 secondi dalla fine segnalo al giocatore lo scadere dell'effetto
  setTimeout(function () {
    PowerPillRInterval = setInterval(recoverPowerPill,500);
  },(TempoPowerPill-4) * 1000);
  
}

//Determina il lampeggio della power Pill gli ultimi 4 secondi
function recoverPowerPill()
{
  Blinky.RecoverySwitch();
  Pinky.RecoverySwitch();
  Inky.RecoverySwitch();
  Clyde.RecoverySwitch();
}
function disablePowerPill()
{
  clearInterval(PowerPillRInterval);
  Blinky.fearNoMore();
  Pinky.fearNoMore();
  Inky.fearNoMore();
  Clyde.fearNoMore();
  continueAmbush(); 
}

//Aggiorno il punteggio (la funzione viene eseguita quando l'"anima" di Pacman è già più avanti rispetto al corpo)
function updateScore()
{
  if(Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] == Codice.Pallina)
  {
    let score= document.getElementById("Score");
    Punteggio+=Mappa.Info[Pacman.pos[0]][Pacman.pos[1]];
    score.innerText=  Punteggio;
    document.getElementById("score").value = Punteggio; //aggiorno il valore da inviare al server
    //rimuovo la pallina
    Mappa.rimuoviPallina(Pacman.pos[0],Pacman.pos[1]);
    Mappa.pallineRimanenti--;
    Pacman.oldvalue = Codice.Vuoto;
  }//Nel caso sia arrivato in una casella con un fantasma, fermo Pacman: attiverà il processo di morte il fantasma assassino
  else if(Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] >= Codice.Blinky)
  { 
    //calcolo il codice effettivo, in quanto vi è la concatenazione del punteggio (1023 -> 23)
    let codiceEffettivo = Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] %100; 
    //Se non è presente un fantasma che è stato già mangiato, che può essere mangiato oppure che che sia spaventato, allora Pacman muore
    if(codiceEffettivo != Codice.Eated && codiceEffettivo != Codice.Eateble && codiceEffettivo != Codice.frightened)
    {
        console.log("Attivazione Condizione");
        clearInterval(Pacman.interval);
        return;
    }
    //Altrimenti non farò niente

  }// Controllo se nella casella vi è una Power Pill
  else if (Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] == Codice.PowerPill)
  {
    startPowerPillTime();
    Mappa.rimuoviPallina(Pacman.pos[0],Pacman.pos[1]);
    Mappa.pallineRimanenti--;
    //Aumento il punteggio
    let score= document.getElementById("Score");
    Punteggio+=50;
    score.innerText=  Punteggio;
    document.getElementById("score").value = Punteggio;
    
  }else{
    //Nel caso non vi sia una pallina e neanche un fantasma prendo il valore del codice dalla matrice
    Pacman.oldvalue = Mappa.Info[Pacman.pos[0]][Pacman.pos[1]];
  }

  //Il punteggio della mappa attuale determina quando far uscire i successivi fantasmi
  if(Mappa.pallineRimanenti==(Mappa.pallineTotali-3) || Mappa.pallineRimanenti==(Mappa.pallineTotali-30) || Mappa.pallineRimanenti==(Mappa.pallineTotali-74))
  {
    coordinatore();
  }
  //Ogni 10000 punti ottengo una vita extra
  if(Punteggio%10000 ==0 && ExtraLife)
  {
    HighScoreSound.volume = document.getElementById("effectVolume").value/100;
    HighScoreSound.play();

    ExtraLife = false;
    Vite++;
    let life= document.getElementById("Life");
    life.innerText = Vite;
  }
    
  //Se sono finite le palline avanzo di livello
  if(Mappa.pallineRimanenti ==0)
    levelUp();
}

function pacmanMovement()
{
  if(Pacman.inMovimento)
    return;
  if(Pacman.pause)
  {
    clearInterval(Pacman.interval);
  }
    
  //cambio animazione
  Pacman.changeAnimation();
  //estrapolo il versore dalla direzione
  let [sxdx,updo] = Pacman.dirTovers(Pacman.direzioneM);
  // controllo se Pacman è fermo
  if(sxdx==0 && updo ==0)
  {
    PacmanAudio.pause();
    return;
  }else{
    PacmanAudio.volume = document.getElementById("effectVolume").value/100;
    PacmanAudio.play();
  }
    
  //controllo che davanti a se non ci sia un muro  
  if(Mappa.Info[Pacman.pos[0]+updo][Pacman.pos[1]+sxdx] == Codice.Muro)
    {
      Pacman.oldDirection = Pacman.direzioneM;
      Pacman.direzioneM = 0;
      PacmanAudio.pause();
      Pacman.changeAnimation();
      return;
    }   
    //La casella in cui era Pacman diventa vuota se c'era una pallina altimenti riprende il vecchio valore
    Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] = Pacman.oldvalue; 
    //AVAMZAMENTO DI PACMAN

    //verifico se siamo in una casella di warp
    if(!Pacman.checkWarp())
    {
      //altrimenti avanzo normalmente
      Pacman.pos[0]+=updo;
      Pacman.pos[1]+=sxdx;
    }
    
    //faccio partire l'animazione
    Pacman.moveAnimation(updateScore);
}

function KeyPress(tasto)
{
  switch(tasto.keyCode) {
    case 37: //freccia sinistra
      Pacman.direzioneM = -1;
      break;
    case 38: //freccia su
      Pacman.direzioneM = 2;
      break;
    case 39: //freccia destra
      Pacman.direzioneM = 1;
      break;
    case 40: //freccia giù
      Pacman.direzioneM = -2;
      break;
    case 32: //spacebar
      if(!GameStarted)
        StartGame();
      break;
  }
}



// FANTASMI ---------------------------------------------------------------------------------//
//FUNZIONI DI UTILITY
function getInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
function VetToVers(v){
  let s = [1,-1];
  if(v==0)
    return s[getInt(0, 1)]; // se un asse è 0 assegno un valore casuale dato che successivamente voglio analizzare
  return v/Math.abs(v);
}
//determina quando far uscire i fantasmi
function coordinatore()
{
  phantomAtHome--;
  switch(phantomAtHome)
  {
    case 2:
      Pinky.interval = setInterval(pinkyMovement,FreqUpdateMovement);
    break;
    case 1:
      Inky.interval = setInterval(inkyMovement,FreqUpdateMovement);
    break;
    case 0:
      Clyde.interval = setInterval(clydeMovement,FreqUpdateMovement);
    break;
  }
}


//funzioni dedicate all'alternanza delle fasi dei fantasmi, per simulare le "ondate".
function scatterMode() //Ognuno torna nella sua zona di comfort
{
  Indicefasi++;
  if(fasiLivellof[Indicefasi]==-1)
    return;

  Blinky.switchMode();
  Pinky.switchMode();
  Inky.switchMode();
  Clyde.switchMode();

  SwitchModeTimeouts[0] = setTimeout(chaseMode,fasiLivellof[Indicefasi]*1000); 
}

function chaseMode() //ognuno va a cercare di cacciare pacman secondo la propria intelligenza artificiale
{
  Indicefasi++;
  Blinky.switchMode();
  Pinky.switchMode();
  Inky.switchMode();
  Clyde.switchMode();
  if(fasiLivellof[Indicefasi]!=-1)
    SwitchModeTimeouts[1] = setTimeout(scatterMode,fasiLivellof[Indicefasi]*1000);

}

function IncrementScore(value,pos)
{
  let score= document.getElementById("Score");
  Eatedphantom++;
  Punteggio+=(Math.pow(2,Eatedphantom)*100);
  score.innerText=  Punteggio;
  //Rimozione pallina nel caso il fantasma fosse sopra una pallina
  if(value == Codice.Pallina)
  {
    Punteggio+=Codice.Pallina;
    score.innerText=  Punteggio;
    //rimuovo la pallina
    Mappa.rimuoviPallina(pos[0],pos[1]);
    Mappa.pallineRimanenti--;
    Pacman.oldvalue = Codice.Vuoto;
  }
  //aggiorno il valore da inviare al server
  document.getElementById("score").value = Punteggio; 
}

function GhostDeathAudio()
{
  PacmanGhostEatingAudio.volume = document.getElementById("effectVolume").value/100;
  PacmanGhostEatingAudio.play();
}

//FANTASMA ROSSO: BLINKY
//Implementazione dell'intelligenza artificiale di Blinky (fantasma rosso)
// E' il fatasma più aggressivo, insegue Pacman

function blinkyMovement()
{
  Blinky.move();
  if(Blinky.pos[0] == Pacman.pos[0] && Blinky.pos[1] == Pacman.pos[1])
  {
    //Se Pacman non ha preso la Power pellet
    if(!Blinky.frightened)
    {
      //pacman Muore
      clearInterval(Blinky.interval);
      pacmanDeath();
    }else if(!Blinky.eated) //Se Pacman ha preso la Power pellet
    {
      GhostDeathAudio();
      //il fantasma muore
      IncrementScore(Blinky.oldvalue,Blinky.pos);
      Blinky.passAway();
      
    }
  }
}
function blinkyAI(){

  //decido che direzione intraprendere, semplicemento inseguo Pacman
  Blinky.selectPathByTarget(Pacman.pos);  
}

//FANTASMA ROSA: Pinky
//Implementazione dell'intelligenza artificiale di Pinky
// E' l'unico fantasma femmina, cerca di prevedere dove andrà Pacman per sorprenderlo, è anche il più veloce
function pinkyMovement()
{
  Pinky.move();
  if(Pinky.pos[0] == Pacman.pos[0] && Pinky.pos[1] == Pacman.pos[1])
  {
    //Se Pacman non ha preso la Power pellet
    if(!Pinky.frightened)
    {
      //pacman Muore
      clearInterval(Pinky.interval);
      pacmanDeath();
    }else if(!Pinky.eated) //Se Pacman ha preso la Power pellet e il fantasma non è già morto
    {
      GhostDeathAudio();
      //il fantasma muore
      IncrementScore(Pinky.value,Pinky.pos);
      Pinky.passAway();
      
    }
  }
}
function pinkyAI(){
  let direzionePacman;
  if(Pacman.direzioneM == 0)
    direzionePacman = Pacman.oldDirection;
  else
  direzionePacman = Pacman.direzioneM;

  //determino la direzione di pacman e la trasformo in versore
  let dirPac = Pinky.dirTovers(direzionePacman);
  //calcolo la casella target spostando di 4 la posizione di pacma
  let posTarget = [Pacman.pos[0]+dirPac[0]*4,Pacman.pos[1]+dirPac[1]*4];
  //decido quale direzione intraprendere
  Pinky.selectPathByTarget(posTarget);

}

//FANTASMA Blu: Inky
//Implementazione dell'intelligenza artificiale di Inky
// E' il più intelligente dei fantasmi, pur non avendo lo stesso coraggio di Blinky e Pinky
//Adotta come strategia quella di bloccare il tunnel più vicino a Pac-Man intercettandolo dalla parte opposta. Sincronizzandosi con Blinky
function inkyMovement()
{
  Inky.move();
  if(Inky.pos[0] == Pacman.pos[0] && Inky.pos[1] == Pacman.pos[1])
  {
    //Se Pacman non ha preso la Power pellet
    if(!Inky.frightened)
    {
      //pacman Muore
      clearInterval(Inky.interval);
      pacmanDeath();
    }else if(!Inky.eated) //Se Pacman ha preso la Power pellet
    {
      GhostDeathAudio();
      //il fantasma muore
      IncrementScore(Inky.oldvalue,Inky.pos);
      Inky.passAway();
      
    }
  }
}
function inkyAI(){
  let direzionePacman;
  if(Pacman.direzioneM == 0)
    direzionePacman = Pacman.oldDirection;
  else
  direzionePacman = Pacman.direzioneM;

  //determino la direzione di pacman e la trasformo in versore
  let dirPac = Inky.dirTovers(direzionePacman);
  //calcolo la casella target spostando di 2 la posizione di pacma
  let posTarget = [Pacman.pos[0]+dirPac[0]*2,Pacman.pos[1]+dirPac[1]*2];
  //Determino il vettore distanza tra Blinky e la casella target ottenuta
  let vetdistanza= [posTarget[0]-Blinky.pos[0],posTarget[1]-Blinky.pos[1]];
  //Determino la casella target finale sommandoci il vettore distanza
  posTarget= [posTarget[0]+vetdistanza[0],posTarget[1]+vetdistanza[1]];
  //decido quale direzione intraprendere
  Inky.selectPathByTarget(posTarget);
  
}

//FANTASMA Arancione: Clyde
//Implementazione dell'intelligenza artificiale di Clyde
// è noto come lo "stupido" del gruppo ed effettua le traiettorie più casuali, spesso controproducenti.
//È anche il più lento dei quattro e non insegue mai Pac-Man a meno che questi non sia già inseguito da un altro fantasma. 

function clydeMovement()
{
  Clyde.move();
  if(Clyde.pos[0] == Pacman.pos[0] && Clyde.pos[1] == Pacman.pos[1])
  {
    //Se Pacman non ha preso la Power pellet
    if(!Clyde.frightened)
    {
      //pacman Muore
      clearInterval(Clyde.interval);
      pacmanDeath();
    }else if(!Clyde.eated) //Se Pacman ha preso la Power pellet
    {
      GhostDeathAudio();
      //il fantasma muore
      IncrementScore(Clyde.oldvalue,Clyde.pos);
      Clyde.passAway();
      
    }
  }
}
function clydeAI(){
  //determino la distanza che intercorre da Clyde a Pacman
  let distanzaDaPac = Clyde.pathLength(Clyde.pos,Pacman.pos);
 //Se è distante più di 8 caselle
  if(distanzaDaPac>8)
    Clyde.selectPathByTarget(Pacman.pos);  //utilizza il metodo di Blinky
  else
    Clyde.selectPathByTarget(Clyde.scatterTarget);  // Va in Scatter mode
}

//FUNZIONI RELATIVE ALLA DIFFICOLTà PROGRESSIVA DEI LIVELLI-----------------------------------------//
function pauseAmbush()
{
  //Metto in pausa l'alternanza tra Scatter e Chase
  for (t of SwitchModeTimeouts)
  clearInterval(t);
}

function continueAmbush(){
  if(fasiLivellof[Indicefasi] == -1) // sono già passate tutte le fasi, quindi vi è solo la Chase
  {
    //Essendo stata assegnata per ultima non devo fare niente
    return;
  }
  if(Indicefasi%2 == 0) // l'ultimo Timeout è stato chiamato da Scatter
  {
    chaseMode();
  }else if(Indicefasi%2 != 0)// l'ultimo Timeout è stato chiamato da Chase
  {
    scatterMode();
  }
}

//termina tutti i movimenti in gioco, senza cambiare le animazioni delle direzioni
function stop()
{
  Pacman.pause = true;
  Blinky.pause = true;
  Pinky.pause = true;
  Inky.pause = true;
  Clyde.pause = true;
  
  pauseAmbush();
}

function go(total = true)
{
  Pacman.pause = false;
  Blinky.pause = false;
  Pinky.pause = false;
  Inky.pause = false;
  Clyde.pause = false;
  
  // total determina una pausa parziale o totale, la differenza sta nel caso serva riazzerare le ondate o no
  // "Riavvio parziale" è lasciare in sospeso la gestione delle ondate per riazzerarle
  // "Riavvio totale" è riprendere il normale flusso di gioco
  if(total)
  { 
    //Faccio Ripartire le Ondate
    continueAmbush();
    //Faccio Ripartire Pacman
    Pacman.interval = setInterval(pacmanMovement,FreqUpdateMovement);
    //Faccio ripartire i Fantasmi
    //Blinky Riparte a priori
    Blinky.interval = setInterval(blinkyMovement,FreqUpdateMovement);

    //Gli altri fantasmi riparto se erano già usciti
    let faEranoUsciti = phantomAtHome;
    phantomAtHome = 3;
    for(let i = 0;phantomAtHome-i>faEranoUsciti && i<3;i++)
    {
      coordinatore();
    }
  }
    
}

//determina la costruzione del nuovo livello, con tanto di ripristino delle caratteristiche dei fantasmi
function RestoreSegment(PallineIncluse)
{
  //disattivo l'audio di pacman 
  PacmanAudio.pause();
  //Tolgo la scritta di Game Over
  document.getElementById("gameOver").style.visibility = "hidden";
  //Reset di pacman
  Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] = Codice.Vuoto;
  Pacman.pos[0] = Pacman.spawnPosition[0];
  Pacman.pos[1] = Pacman.spawnPosition[1];
  Mappa.Info[Pacman.pos[0]][Pacman.pos[1]] = Pacman.id;
  let td = Mappa.getTd(Pacman.spawnPosition[0],Pacman.spawnPosition[1]);
  td.appendChild(Pacman.imgTag);
  Pacman.direzioneM = 0;
  Pacman.oldDirection = 1;
  Pacman.changeAnimation();
  Pacman.inMovimento = false;

  //reset fantasmi
  Blinky.spawnPosition = [10,10]; // Blinky riparte sempre fuori
  Blinky.Reset();
  Blinky.spawnPosition = [12,10];
  Pinky.Reset();
  Inky.Reset();
  Clyde.Reset();
  //Reset Timeout
  Indicefasi = -1;

  //Mappa
  //Se è valido significa che stiamo passando ad un nuovo livello, altrimenti sto resettando alla morte di Pacman
  if(PallineIncluse)
  {
    phantomAtHome =3;
    Mappa.Reset();
  }
    
  
  //Riattivo le animazioni
  go(false);
  //riattivo la scritta per indicare l'inizio del livello
  controlTextStart(true);
  GameStarted = false;
}


function Restore(stopV = true,PallineIncluse = true)
{
  if(stopV)
    stop();
  setTimeout(function () {RestoreSegment(PallineIncluse);},tempoFineAnimazioni);//aspetto 2 secondi per far terminare tutte le animazioni
}

//determina la creazione del nuovo livello e l'avanzamento della difficoltà
function levelUp()
{
  let Livello = document.getElementById("Level");
  const fattoreIncremento = 0.01;
  ExtraLife = true;
  Level++;
  Livello.innerText = Level;
  
  //Incremento velocità dei personaggi ogni 5 livelli, da dopo il 200 diventa abbastanza ingestibile
  if(Level%5==0)
  {
    Pacman.velocita -=fattoreIncremento;
    Blinky.velocita -=fattoreIncremento;
    Pinky.velocita -=fattoreIncremento;
    Inky.velocita -=fattoreIncremento;
    Clyde.velocita -=fattoreIncremento;
  }
  //Aumento la difficoltà diminuendo l'alternanza delle ondate. Al 7° livello cessa di esistere, e permane solo la modalità Chase
  for (let i=0;i<fasiLivellof.length;i++)
  {
    if(i%2 ==0) //fase di scatter
    {
      fasiLivellof[i]-=1;
    }else if(i%2 !=0) //fase di Chase
    {
      fasiLivellof[i]+=1;
    }
  }

  //Aumento difficoltà tramite la diminuzione del tempo della Power Pill, dopo il quinto livello le power pill non sono più presenti
  TempoPowerPill--;
  if(TempoPowerPill == 5)
    Mappa.PillPresence = false;
  //Faccio Partitire il suono di Level Up
  levelUpSound.volume = (document.getElementById("effectVolume").value)*6/100;
  levelUpSound.play();
  //ricreazione dell'ambiente di gioco
  Restore();
}

// FUNZIONI VARIE---------------------------------------------------------------------------------//

//Determina la scritta "Press Space to start"
function ScrittaStart()
{
  let div = document.getElementById("startText");
  if(div.style.visibility == "hidden")
    div.style.visibility = "visible";
  else
    div.style.visibility = "hidden";
}

function controlTextStart(attivo)
{
  let div = document.getElementById("startText");
  if(attivo)
  {
    startTextInterval = setInterval(ScrittaStart,1000);
  }
  else
  {
    clearInterval(startTextInterval);
    div.style.visibility = "hidden";
  }

}

function Inizializza(){
  //Creazione mappa
  Mappa = new GameMap("GameBoard",27,21); //27x21 (25 interna + 2 muri v) x (19 +2 muri)
  Pacman = new Personaggio([20,10],PacImg,Mappa,Codice.Pacman,LvZ.vInizialePers,Codice.Vuoto);
  Mappa.toClassic();
  Mappa.Reset();
  //Inserisco le vite e il livello attuale
  let livello = document.getElementById("Level");
  livello.innerText = Level;
  let vite = document.getElementById("Life");
  vite.innerText = Vite;
  //attivazione tastiera e movimento di Pacman
  document.onkeydown = KeyPress;
  //CREAZIONE FANTASMI
  //Blinky
  Blinky = new Fantasma([10,10],PhantomImg[0],Mappa,Codice.Blinky,LvZ.vInizialePers,[0,18],blinkyAI,Codice.NotASpace,PhantomDeathimg);
  Blinky.atHome = false; //Blinky parte fuori dalla Casa
  Blinky.oldvalue = Codice.Pallina //dato che parte da fuori, Blinky è sopra una pallina

  //Pinky
  Pinky = new Fantasma([13,10],PhantomImg[1],Mappa,Codice.Pinky,LvZ.vInizialePers,[0,2],pinkyAI,Codice.NotASpace,PhantomDeathimg);

  //Inky
  Inky = new Fantasma([13,9],PhantomImg[2],Mappa,Codice.Inky,LvZ.vInizialePers,[28,0],inkyAI,Codice.NotASpace,PhantomDeathimg);

  //Clyde
  //Inky
  Clyde = new Fantasma([13,11],PhantomImg[3],Mappa,Codice.Clyde,LvZ.vInizialePers,[28,1],clydeAI,Codice.NotASpace,PhantomDeathimg);

  //faccio partire l'animazione della scritta
  controlTextStart(true);
}

function StartGame()
{
  // Il gioco è inziato, impedisco di premere space
  GameStarted = true;
  //Consento di inviare il punteggio
  document.getElementById("sendScore").disabled = false;
  // Disattivo la scritta
  controlTextStart(false);
  //Attivo il movimento di Pacman
  Pacman.interval = setInterval(pacmanMovement,FreqUpdateMovement);
  //attivazione Blinky, gli altri fantasmi si attivano in relazione a Pacman
  Blinky.interval = setInterval(blinkyMovement,FreqUpdateMovement); // Inizializzo l'interval
  Blinky.spawnPosition = [12,10];
  //attivazione degli altri fantasmi nel caso ci sia stato un restart dovuto ad una morte
  let faEranoUsciti = phantomAtHome;
  phantomAtHome = 3;
  for(let i = 0;phantomAtHome-i>faEranoUsciti && i<3;i++)
  {
    setTimeout(coordinatore,(i+1)*3000);
  }
  //attivazione ondate
  scatterMode();
}