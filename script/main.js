//Modaler Dialog
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

// let colorModal = new bootstrap.Modal(document.getElementById('colorSelection'));

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

let gameID = 0;
let players_global = [];
let currentPlayer = 1;
let currentPlayerName = "";
let gameDirection = 1;


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
            const span = document.createElement("span");
            console.log("span: ", span);
            document.getElementById("spieler" + index).appendChild(span);
            span.textContent = players_global[index - 1] ;

        };
         startGame();
       // showPoints();
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


function showDiscardPile(card){
    const discardpile = document.querySelector('.discardpile');
    const img = document.createElement('img');
    img.setAttribute("id", "discardCard");
    discardpile.appendChild(img);
    img.src = `${cardseURL}${convertCardURL(card)}.png`;
}

function updateDiscardPile(card){
    const discardpile = document.querySelector('.discardpile');
    console.log(discardpile);
    document.getElementById("discardCard").src = `${cardseURL}${convertCardURL(card)}.png`;
}

async function startGame() {
    let players = [];
    for (let i = 1; i < 5; i++) {
        
        players.push(players_global[i-1]);
    }
 
   try{
    const response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start/", {
        method: 'POST',
        body: JSON.stringify(players),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    const result = await response.json();
     gameID = result.Id;   
     showDiscardPile(await getTopCard());
     showCards(result);
     showPoints(result);
     console.log(result); 
     displayCurrentPlayer(players_global.findIndex((e) => e === result.NextPlayer)+1);
     currentPlayerName = result.NextPlayer;
    } catch (error) {
    console.log(error)
   }
    
}

async function getTopCard() {
    try {
        let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + gameID);
        let result = await response.json();
        console.log('-----------------------');
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}


function showCards(result) {
    result.Players.forEach((player, index) => {

        const hk = document.querySelectorAll('#hk');
        const ul = document.createElement("ul"); // create 
        ul.classList.add('ul-card');
        ul.setAttribute("id", `${player.Player}-hk`);
        // create back cards list for non active players
        backCardsUl = document.createElement('ul');
        backCardsUl.classList.add("backCards")
        backCardsUl.setAttribute("id", `${player.Player}-back`);
        hk[index].appendChild(ul);
        hk[index].appendChild(backCardsUl)
        player.Cards.map(e => {
            const button = document.createElement("button");
            const img = document.createElement("img");
            button.classList.add('button-card')
            img.classList.add('img-card')
            button.appendChild(img);
            ul.appendChild(button);
            
            img.src = `${cardseURL}${convertCardURL(e)}.png`;
            img.addEventListener('click', function () {
                playCard(e);
            })
        });
    })
}

function convertCardURL(card){
    if (card.Value == 10) { 
        return `${card.Color.charAt(0)}${card.Text.charAt(0)}${card.Text.charAt(4)}`;
    } else if (card.Value == 11 || card.Value == 12) {
        return `${card.Color.charAt(0)}${card.Text.charAt(0)}`;
    } else if (card.Value == 13) {
        card.Value = "wd4";
        return `${card.Value}`;
    } else if (card.Value == 14) {
        card.Value = "wild";
        return `${card.Value}`;
    } else {
        return `${card.Color.charAt(0)}${card.Value}`;
    }
}

async function getCardsOfPlayer(playerName){
    try {
        let response = await fetch(`http://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${playerName}`);
        let result = await response.json();
        console.log(`getCardsOfPlayer: ${result.Player} / currentPlayerName: ${currentPlayerName}`);
        return result;
    } catch (error) {
        console.log(error);
    }  
}


// to do, after play a card, the player hand will be updated.
async function updatePlayerCards(playerName){
let playerCardsResult = await getCardsOfPlayer(playerName);  
const playerUL = document.getElementById(playerName+"-hk");
const playerUlBack = document.getElementById(`${playerName}-back`);
console.log(`updatePlayerCards Player Name: ${playerName}`);
console.log(" before");
console.log(playerUL);
console.log(playerCardsResult);

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};
removeChildren(playerUL);
removeChildren(playerUlBack)
console.log(" after");
console.log(playerUL);

playerCardsResult.Cards.map(e => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    button.classList.add('button-card')
    img.classList.add('img-card')
    button.appendChild(img);
    playerUL.appendChild(button);
    img.src = `${cardseURL}${convertCardURL(e)}.png`;
    img.addEventListener('click', function () {
        playCard(e);
});
})
updatePlayerPoint(playerName, playerCardsResult);
}


function updatePlayerPoint(playerName, playerCardsResult){
    let point = 0;
    playerCardsResult.Cards.forEach(card=> point += card.Score);
    const playerPointSpan = document.getElementsByClassName(playerName+"Point")[0];
    console.log(playerPointSpan);
    console.log("new points are: "+point);
    playerPointSpan.textContent = point;
}


function showPoints(result) {
    result.Players.forEach((player, index) => {
        let points = 0;
        let getPLayer = document.getElementById('spieler' + (index+1));
        const span = document.createElement('span');
        span.className = players_global[index]+"Point";
        player.Cards.forEach(c => points+=c.Score );
        span.textContent = points;
        getPLayer.appendChild(span );
    })
} 


const drawCard = async () => {
    try{
        
        const response = await fetch(`https://nowaunoweb.azurewebsites.net/api/game/drawCard/${gameID}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });
        if (response.ok) {
        const result = await response.json();
        const playerCardsUl = document.getElementById(result.Player+"-hk");
        console.log("--------------------------")
        console.log(result);
        console.log(playerCardsUl);
        const button = document.createElement("button");
        const img = document.createElement("img");
        button.classList.add('button-card')
        img.classList.add('img-card')
        button.appendChild(img);
        playerCardsUl.appendChild(button);
        img.src = `${cardseURL}${convertCardURL(result.Card)}.png`;
        img.addEventListener('click', function () {
        playCard(result.Card);       
        })

        const playerUlBack = document.getElementById(`${result.Player}-back`);
        const removeChildren = (parent) => {
            while (parent.lastChild) {
                parent.removeChild(parent.lastChild);
            }
        };

        removeChildren(playerUlBack);
        const playerPointSpan = document.getElementsByClassName(result.Player+"Point")[0];
        let pointString = playerPointSpan.textContent;
        let point = 0;
        console.log("points before: "+ pointString);
        point = parseInt(pointString) + result.Card.Score;
        console.log("points after: "+ point);
        playerPointSpan.textContent = point;
        currentPlayerName = result.NextPlayer;
        displayCurrentPlayer(players_global.findIndex((e) => e === result.NextPlayer)+1);

   
        } else console.log("error in drawCard of response in server");

    }
    catch(error) {
        console.log(error)
    }

}


const drawCardButton = document.getElementById('drawButton');
drawCardButton.addEventListener('click', drawCard);



// 2 functions rendering back cards for not active players
const displayCurrentPlayer = (player) => {
const cardsUl = document.querySelectorAll('.ul-card');
const backCardsUl = document.querySelectorAll('.backCards')

    // create temporary array of 4 players
    const tempPlayersArray = [1, 2, 3, 4];
    // filter temp array and create new array of not active players
    const notActivePlayers = tempPlayersArray.filter(p => {
        return p !== player
    });
    cardsUl[player - 1].classList.remove("hidden");
    backCardsUl[player - 1].classList.add("hidden");

    notActivePlayers.forEach(player => {
        cardsUl[player - 1].classList.add("hidden")
        backCardsUl[player - 1].classList.remove("hidden")
    });

    displayHiddenPlayerCards(notActivePlayers, cardsUl);
    
};


const displayHiddenPlayerCards = (notActivePlayers, cardsUl) => {
    const backCardsUl = document.querySelectorAll('.backCards')
    notActivePlayers.forEach((player) => {
        const cardsNum = cardsUl[player - 1].children.length;
        console.log(`cardsNum : ${player} has ${cardsNum}`);
        // if backcards are already generated dont render back cards again
        // but if open cards number changed eg. player 1 has now 8 not 7 cards
        // render back cards again accoridingly to 8
        if(backCardsUl[player - 1].children.length < 1 
            || backCardsUl[player - 1].children.length !== cardsNum) { 
        for(let i = 1; i <= cardsNum; i++) {
                const img = document.createElement('img')
                img.src = `https://nowaunoweb.azurewebsites.net/Content/back.png`;
                backCardsUl[player - 1].appendChild(img)
            } 
        }
    })
}

async function playCard(card,wildColor){
    // console.log(validSelectedCard(card));
    if(await validSelectedCard(card)===true){
        try{
        let id = gameID;
        let value = card.Value;
        let color = card.Color;
        if(card.Value==13||card.Value==14){
            // colorModal.show();
            wildColor = "select Color"; // add element to change color of the game
            

        }  else wildColor= "";   
        let previousPlayerName = currentPlayerName;
        
        const response = await fetch(`https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/${id}?value=${value}&color=${color}&wildColor=${wildColor}`, {
            method: "PUT", 
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        });
        const result = await response.json();
        console.log(result);
        await updatePlayerCards(previousPlayerName);
        // displayCurrentPlayer(players_global.findIndex((e) => e === previousPlayerName)+1);
        console.log(`current player name: ${result.Player}`);
        currentPlayerName = result.Player;
        displayCurrentPlayer(players_global.findIndex((e) => e === result.Player)+1);
        updateDiscardPile(card);
        if (card.Value == 12) {
            changeGameDirection();
          }
    } catch(error) {
        console.log(error)
    }
    }else{
        //add animation for error warning!
    }
    
}


async function getCurrentPlayerCards(){
   
    const response = await fetch(`https://nowaunoweb.azurewebsites.net/api/Game/GetCards/${gameID}?playerName=${currentPlayerName}`, {
        method: "GET", 
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    });
    return response.Cards;

}

async function validSelectedCard(card){
    console.log("verifying if the selected card is valid to play"+ card);
    let topCard = await getTopCard();
    console.log(card);
    console.log(topCard);
    if (card.Value === topCard.Value || card.Color === topCard.Color || (card.Color === topCard.Color && card.Value === 13) || card.Value ===14) 
    {
        console.log("Card is valid.")
        return true;
    }
        else 
    { console.log("Wrong card was played!")
        return false;}
         
}


function changeGameDirection() {
    const gameDirection_gif = document.getElementById("gif");

    if(gameDirection == 1) {
      gameDirection_gif.src = "img/direction_reverse.gif";
      console.log('direction is reversed');
      console.log(gameDirection.src);
      gameDirection = -1;
    } else {
      gameDirection_gif.src="img/direction.gif";
      console.log(gameDirection.src);
      console.log('direction is normal');
      gameDirection = 1;
}
console.log(gameDirection.src);
}
