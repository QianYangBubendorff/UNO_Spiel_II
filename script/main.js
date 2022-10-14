// Modalen Dialog öffnen um Namen einzugeben
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();
let playersList = [];

// nach jeder tasteneingabe im formular überprüfen ob
// 4 eindeutige spielerInnennamen vorhanden sind
document.getElementById('playerNamesForm').addEventListener('keyup', function(evt) {
    console.log(evt);

})

// formular submit abfangen
document.getElementById('playerNamesForm').addEventListener('submit', function(evt){   
    console.log("submit");
    // Formular absenden verhindern
    // console.log('Name of Player 1 is: ' + document.getElementById('playerName1').value);
    // console.log('Name of Player 2 is: ' + document.getElementById('playerName2').value);
    // console.log('Name of Player 3 is: ' + document.getElementById('playerName3').value);
    // console.log('Name of Player 4 is: ' + document.getElementById('playerName4').value);
    
    evt.preventDefault();
    myModal.hide();

    const ul = document.getElementById('playersList');
    playersList = [document.getElementById('playerName1').value, document.getElementById('playerName2').value, document.getElementById('playerName3').value, document.getElementById('playerName4').value];

    for (let player of playersList){
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = player;
        li.appendChild(span);
        ul.appendChild(li);
    }
})
