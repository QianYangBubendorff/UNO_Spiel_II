//Modaler Dialog
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

let cardseURL = "http://nowaunoweb.azurewebsites.net/Content/Cards/";

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

const hopalaDiv = document.querySelector('.hopala')
const containerDiv = document.querySelector('.margin-top')
document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    console.log(evt);
})

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    console.log("Spieler hat Button 'Spiel starte' gedrückt!");
    console.log("Name von Spieler 1: ", document.getElementById("playerName1").value);
    console.log("Name von Spieler 2: ", document.getElementById("playerName2").value);
    console.log("Name von Spieler 3: ", document.getElementById("playerName3").value);
    console.log("Name von Spieler 4: ", document.getElementById("playerName4").value);

    players_global = [document.getElementById("playerName1").value, document.getElementById("playerName2").value,
    document.getElementById("playerName3").value, document.getElementById("playerName4").value];

    if (checkDuplicatedAndEmptyNames() == true) {
        hopalaDiv.classList.remove('hidden')
        containerDiv.classList.remove('margin-top')
        evt.preventDefault();
        myModal.hide();
        console.log("Spieler: ", players_global);
        for (let index = 1; index < 5; index++) {
            const span = document.createElement("span" + index);
            console.log("span: ", span);
            document.getElementById("spieler" + index).appendChild(span);
            span.textContent = players_global[index - 1];
        };
    } else evt.preventDefault();
})

function checkDuplicatedAndEmptyNames() {
    var names = [];
    let emptyNameAlerted = false;
    let duplicateAlerted = false;
    for (i = 1; i < 5; i++) {
        names[i - 1] =
            document.getElementById("playerName" + i).value;
    }
    for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 4; j++) {
            if (i == j) continue;
            if (names[i] == "" || names[j] == "") {
                if (!emptyNameAlerted) {
                    alert('Please choose a name for each player');
                    emptyNameAlerted = true;
                }
                continue;
            }
            if (names[i] == names[j]) {
                if (!duplicateAlerted) {
                    alert('There are duplicated names');
                    duplicateAlerted = true;
                }

                return false;
            }

        }
    }
    return true;
}

// destructure function startGame into smaller functions! 
// example extract displaying cards for each player logic
// fix this post api call -> you push null for player name
// maybe not use this if response.ok check async/await ;) gl

const displayDiscardpile = (data) => {
    const discardpile = document.querySelector('.discardpile');
    const img = document.createElement('img');
    discardpile.appendChild(img);
    const card = `${data.TopCard.Color.charAt(0)}${data.TopCard.Value}`;
    img.src = `${cardseURL}${card}.png`;
}



async function startGame() {
    let players = [];
    for (let i = 1; i < 5; i++) {
        players.push(document.getElementById("spieler" + i).value);
    }
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start/", {
        method: 'POST',
        body: JSON.stringify(players),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    if (response.ok) {

        let result = await response.json();

        console.log(result);

        console.log(JSON.stringify(result));
        displayDiscardpile(result);

        result.Players.forEach((player, index) => {
            
            const hk = document.querySelectorAll('#hk'); 
            const ul = document.createElement("ul"); // create 
            ul.classList.add('ul-card');
            hk[index].appendChild(ul);
            player.Cards.map(e => {
                const li = document.createElement("li");
                const img = document.createElement("img");
                li.classList.add('li-card')
                img.classList.add('img-card')
                li.appendChild(img);
                ul.appendChild(li);
                const card = `${e.Color.charAt(0)}${e.Value}`;
                img.src = `${cardseURL}${card}.png`;
            });
        });
    } else {
        console.log('HTTP-Error: ' + response.status);
    }
}
startGame();

