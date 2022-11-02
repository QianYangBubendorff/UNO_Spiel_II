//Modaler Dialog
let myModal = new bootstrap.Modal(document.getElementById("playerNames"));
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

let gameID = 0;
let players_global = [];
let currentPlayer = 1;

const hopalaDiv = document.querySelector(".hopala");
const containerDiv = document.querySelector(".margin-top");
document
  .getElementById("playerNamesForm")
  .addEventListener("keyup", function (evt) {
    console.log(evt);
  });

document
  .getElementById("playerNamesForm")
  .addEventListener("submit", function (evt) {
    console.log("Spieler hat Button 'Spiel starte' gedrückt!");
    console.log(
      "Name von Spieler 1: ",
      document.getElementById("playerName1").value
    );
    console.log(
      "Name von Spieler 2: ",
      document.getElementById("playerName2").value
    );
    console.log(
      "Name von Spieler 3: ",
      document.getElementById("playerName3").value
    );
    console.log(
      "Name von Spieler 4: ",
      document.getElementById("playerName4").value
    );

    players_global = [
      document.getElementById("playerName1").value,
      document.getElementById("playerName2").value,
      document.getElementById("playerName3").value,
      document.getElementById("playerName4").value,
    ];

    if (checkDuplicatedAndEmptyNames() == true) {
      hopalaDiv.classList.remove("hidden");
      containerDiv.classList.remove("margin-top");
      evt.preventDefault();
      myModal.hide();
      console.log("Spieler: ", players_global);
      for (let index = 1; index < 5; index++) {
        const span = document.createElement("span");
        console.log("span: ", span);
        document.getElementById("spieler" + index).appendChild(span);
        span.textContent = players_global[index - 1];
      }
      startGame();
      // showPoints();
    } else evt.preventDefault();
  });

function checkDuplicatedAndEmptyNames() {
  var names = [];
  let emptyNameAlerted = false;
  let duplicateAlerted = false;
  for (i = 1; i < 5; i++) {
    names[i - 1] = document.getElementById("playerName" + i).value;
  }
  for (i = 0; i < 4; i++) {
    for (j = i + 1; j < 4; j++) {
      if (i == j) continue;
      if (names[i] == "" || names[j] == "") {
        if (!emptyNameAlerted) {
          alert("Please choose a name for each player");
          emptyNameAlerted = true;
        }
        continue;
      }
      if (names[i] == names[j]) {
        if (!duplicateAlerted) {
          alert("There are duplicated names");
          duplicateAlerted = true;
        }
        return false;
      }
    }
  }
  return true;
}

const displayDiscardpile = ({ Value, Color }) => {
  const discardpile = document.querySelector(".discardpile");
  const img = document.createElement("img");
  discardpile.appendChild(img);
  const card = `${Color.charAt(0)}${Value}`;
  img.src = `${cardseURL}${card}.png`;
};

// removed this function from start game bcs i want to use it in other places too
// one function should do one thing!
const createPlayersArray = () => {
    let players = [];
  // here i chamged spieler to playerName because
  // u sent undefined vals to API
  for (let i = 1; i < 5; i++) {
    players.push(document.getElementById("playerName" + i).value);
  }
  return players
}

// extracted getting starting data from api also from start game
// one function does one thing
const getStartingData = async () => {
    const players = createPlayersArray();
    try {
        const response = await fetch(
          "http://nowaunoweb.azurewebsites.net/api/game/start/",
          {
            method: "POST",
            body: JSON.stringify(players),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        const result = await response.json();
        return result
        } catch (e) {
            console.log(e)
        }
}


const startGame = async () => {
    const result = await getStartingData(); 
    gameID = result.Id;
    const topCard = await getTopCard();
    displayDiscardpile(topCard);
    showCards(result.Players);
    showPoints(result.Players);
    displayCurrentPlayer(currentPlayer);
    console.log(result.Players)
    // those 2 functions are called once on start game
    // then called multiple times on specified events
    // getCards is called when card is player (on click card)
    // also (todo...) on drawing card
    drawCard();
    getCards();
    playCard();
}

const getTopCard = async () => {
  try {
    let response = await fetch(
      "http://nowaunoweb.azurewebsites.net/api/Game/TopCard/" + gameID
    );
    let result = await response.json();
    console.log("-----------------------");
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

const showCards = (players) => {
  players.forEach((player, index) => {
    const hk = document.querySelectorAll("#hk");
    const ul = document.createElement("ul"); // create
    ul.classList.add("ul-card");
    // create back cards list for non active players
    backCardsUl = document.createElement("ul");
    backCardsUl.classList.add("backCards");
    hk[index].appendChild(ul);
    hk[index].appendChild(backCardsUl);
    console.log(player.Cards.length)
    player.Cards.map((e) => {
      const button = document.createElement("button");
      const img = document.createElement("img");
      button.classList.add("button-card");
      img.classList.add("img-card");
      button.appendChild(img);
      ul.appendChild(button);
      img.setAttribute("id", `${e.Value}, ${e.Color}, ${e.Text}`);

      if (e.Value == 10) {
        card = `${e.Color.charAt(0)}${e.Text.charAt(0)}${e.Text.charAt(4)}`;
      } else if (e.Value == 11 || e.Value == 12) {
        card = `${e.Color.charAt(0)}${e.Text.charAt(0)}`;
      } else if (e.Value == 13) {
        e.Value = "wd4";
        card = `${e.Value}`;
      } else if (e.Value == 14) {
        e.Value = "wild";
        card = `${e.Value}`;
      } else {
        card = `${e.Color.charAt(0)}${e.Value}`;
      }
      img.src = `${cardseURL}${card}.png`;
    });
  });
}

function showPoints(result) {
  result.forEach((player, index) => {
    let points = 0;
    let getPLayer = document.getElementById("spieler" + (index + 1));
    const span = document.createElement("span");
    player.Cards.forEach((c) => (points += c.Score));
    span.textContent = " " + points + " Punkte";
    getPLayer.appendChild(span);
  });
}

// this functions sends GET Request and returns Player Name, cards
// somehow not working - to be fixed
const getCards = async () => {
const players = createPlayersArray();
 let tempArray = [];
 players.forEach(async (player) => {
    try {
        const response = await fetch(
            `https://nowaunoweb.azurewebsites.net/api/game/GetCards/${gameID}?playerName=${player}`
            );
            const result = await response.json();
            tempArray.push(result)
   
        } catch (e) {
            console.log(e);
        }        
    })
return tempArray
};

// function below gets value/color/text of a card clicked
// however api requires wildColor value --- whats that ???
const playCard = async () => {
  const buttonCards = document.querySelectorAll(".button-card");

  buttonCards.forEach((button) => {
    button.addEventListener("click", async (event) => {
      getCards();
      let tempArray = [event.target.id];
      let currentCard = {
        value: tempArray[0],
        color: tempArray[1],
        text: tempArray[2],
      };

      try {
        if (currentPlayer < 4) {
          currentPlayer = currentPlayer + 1;
          curr = currentPlayer;
        } else if (currentPlayer === 4) {
          currentPlayer = 1;
          curr = currentPlayer;
        }
        const response = await fetch(
          `https://nowaunoweb.azurewebsites.net/api/game/playCard/${gameID}?value=${currentCard.value}&color=${currentCard.color}&wildColor=Red`,
          {
            method: "PUT",
          }
        );
        const result = await response.json();
        console.log(result);
        displayCurrentPlayer(curr);
      } catch (e) {
        console.log(e);
      }
    });
  });
};

// this button is temporary! after implementing playing card delete this code below
// also delete html tag for this button
// logic inside of add event listener is viable in eventlistener attached to card while playing

// TODO
const drawCard = () => {
  const drawCardButton = document.querySelector(".draw-button");

  drawCardButton.addEventListener("click", async () => {
    let curr;
    try {
      if (currentPlayer < 4) {
        currentPlayer = currentPlayer + 1;
        curr = currentPlayer;
      } else if (currentPlayer === 4) {
        currentPlayer = 1;
        curr = currentPlayer;
      }
      const response = await fetch(
        "https://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameID,
        {
          method: "PUT",
        }
      );
      const result = await response.json();
    
      displayCurrentPlayer(curr);
    } catch (error) {
      console.log(error);
    }
    // to be fixed data is somehow invalid 
    const data = await getCards();
    showCards(data)
    console.log(data)
    console.log(data.length)
    // console.log(data.length)
  });
};

// 2 functions rendering back cards for not active players
const displayCurrentPlayer = (player) => {
  const cardsUl = document.querySelectorAll(".ul-card");
  const backCardsUl = document.querySelectorAll(".backCards");

  // create temporary array of 4 players
  const tempPlayersArray = [1, 2, 3, 4];
  // filter temp array and create new array of not active players
  const notActivePlayers = tempPlayersArray.filter((p) => {
    return p !== player;
  });
  cardsUl[player - 1].classList.remove("hidden");
  backCardsUl[player - 1].classList.add("hidden");

  notActivePlayers.forEach((player) => {
    cardsUl[player - 1].classList.add("hidden");
    backCardsUl[player - 1].classList.remove("hidden");
  });

  displayHiddenPlayerCards(notActivePlayers, player, cardsUl);
};

const displayHiddenPlayerCards = (notActivePlayers, player, cardsUl) => {
  const backCardsUl = document.querySelectorAll(".backCards");
  notActivePlayers.forEach((player) => {
    const cardsNum = cardsUl[player - 1].children.length;
    // if backcards are already generated dont render back cards again
    // but if open cards number changed eg. player 1 has now 8 not 7 cards
    // render back cards again accoridingly to 8
    if (
      backCardsUl[player - 1].children.length < 1 ||
      backCardsUl[player - 1].children.length !== cardsNum
    ) {
      for (let i = 1; i <= cardsNum; i++) {
        const img = document.createElement("img");
        img.src = `https://nowaunoweb.azurewebsites.net/Content/back.png`;
        backCardsUl[player - 1].appendChild(img);
      }
    }
  });
};
