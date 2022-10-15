//Modaler Dialog
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();


// Constructor Card
function Card(color, text, value, score) {
    this.Color = color;
    this.Text = text;
    this.Value = value;
    this.Score = score;
}


// Constructor Player
function Player(name, cards = [], score = -1) {
    this.Name = name;
    this.Cards = cards;
    this.Score = score;
}



let players_global = ["a","b"];

document.getElementById('playerNamesForm').addEventListener('keyup', function(evt) {
    console.log(evt);
})


document.getElementById('playerNamesForm').addEventListener('submit', function(evt){   
 console.log("Spieler hat Button 'Spiel starte' gedrückt!");
    
    evt.preventDefault();
    myModal.hide();

    console.log("Name von Spieler 1: ", document.getElementById("playerName1").value);
    console.log("Name von Spieler 2: ", document.getElementById("playerName2").value);
    console.log("Name von Spieler 3: ", document.getElementById("playerName3").value);
    console.log("Name von Spieler 4: ", document.getElementById("playerName4").value);
    
    players_global = [document.getElementById("playerName1").value, document.getElementById("playerName2").value, 
    document.getElementById("playerName3").value,document.getElementById("playerName4").value];

    console.log("Spieler: ", players_global);

    let playerliste_html_ul = document.getElementById("liste_von_player");

    players_global.forEach(ein_player_name => {
        const li = document.createElement("li");
        console.log("li: ", li);
        const span = document.createElement("span");
        console.log("span: ", span);

        li.appendChild(span);
        playerliste_html_ul.appendChild(li);

        span.textContent=ein_player_name;
    });
})
