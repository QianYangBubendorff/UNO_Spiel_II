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



let players_global = [];

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

    let player1_1 = document.getElementById("spieler1_1");
    let player2_2 = document.getElementById("spieler2_2");
    let player3_3 = document.getElementById("spieler3_3");
    let player4_4 = document.getElementById("spieler4_4");

for (let index = 1; index < 5; index++)  {
        const span = document.createElement("span"+index);
        console.log("span: ", span);
        document.getElementById("spieler"+index).appendChild(span);
        span.textContent=players_global[index-1]; 
    };
})
