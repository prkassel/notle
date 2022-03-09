let hasPlayed = localStorage.getItem('hasPlayed');

let tileCount = 0;
let playerTurn = 0;
let flatToggled = false;
let keyboardDisabled = false;
let playerDisabled = false;
let gameOver = false;

let currentGuess = [];

const todaysMelody = {
    "answer": [6,6,7,9,9],
    "revealMelody": [6,6,7,9,9,7,6,4,2,2,4,6,6,-100,4]
};


if (!hasPlayed) {
    document.getElementById('introModal').style.display = 'initial';
}

document.querySelectorAll('.close').forEach(function(item) {
    item.addEventListener('click', function(e) {
        console.log(e);
        if (e.target.attributes.id.nodeValue === 'closeIntro') {
            document.getElementById('introModal').style.display = 'none';
            localStorage.setItem('hasPlayed', true);
        }
        else if (e.target.attributes.id.nodeValue === 'closeSuccess') {
            document.getElementById('successModal').style.display = 'none';
        }
    });
});





document.getElementById('musicPlayer').addEventListener('click', function(e) {
     if (playerDisabled !== true) {
        playSequence(todaysMelody.answer);
        document.getElementById('musicPlayer').classList.add('disabled');
     }
});



document.getElementById('keyboard').addEventListener('mousedown', function(e) {
    let playerSelection = e.target.getAttribute('note');
    
    if (playerSelection == 'submit') {
        keyboardDisabled? playerGuess() : alert('not enough notes');
    }

    else if (playerSelection == 'delete') {
        console.log(tileCount, playerTurn * 5);
        if (tileCount > 0 && tileCount > playerTurn * 5) {
            deleteLastSelection();
        }
    }

    else if (playerSelection == 'acc_toggle') {
        toggleKeyboard();
    }
    else if (!keyboardDisabled) {
        playerSelect(playerSelection);
    }
});


function playerGuess() {
    playerTurn += 1;
    keyboardDisabled = false;
    let results = checkAnswer(currentGuess);


    for (i = 0; i < results[1].length; i++) {
        let loc = (tileCount - 4) + i;
        let guessTile = document.querySelector(`[tile="${loc}"]`);
        guessTile.classList.add(results[1][i]);
    }

    if (!results[0]) {
        playSequence(currentGuess);
        // last thing is delete the current guesses and turn the player on
        currentGuess = [];
        playerDisabled = false;
        document.getElementById('musicPlayer').classList.remove('disabled');
    }
    else {
        playSequence(todaysMelody.revealMelody);
        winner();
        keyboardDisabled = true;
        playerDisabled = true;
    }
}


function toggleKeyboard() {

    let flats = document.getElementsByClassName('flat');
    let sharps = document.getElementsByClassName('sharp');

    if (flatToggled) {
        Array.from(sharps).forEach(function(sharp) {
            sharp.style.display = 'flex';
        });
        Array.from(flats).forEach(function(flat) {
            flat.style.display = 'none';
        });
        flatToggled = false;
    }
    else {
        Array.from(sharps).forEach(function(sharp) {
            sharp.style.display = 'none';
        });
        Array.from(flats).forEach(function(flat) {
            flat.style.display = 'flex';
        });

        flatToggled = true;
    }

}

function playerSelect(playerSelection) {

    let noteNames = playerSelection >= 12? notesList[playerSelection - 12]: notesList[playerSelection];
    tileCount += 1;

    let currentTile = document.querySelector(`[tile="${tileCount}"]`);

    if (noteNames.length == 2) {
        flatToggled? currentTile.innerHTML = noteNames[1] : currentTile.innerHTML = noteNames[0]
    }

    else {
        currentTile.innerHTML = noteNames[0];
    }
    currentTile.classList.add('tile__played');

    // last tile of the turn, ready for player to guess 
    tileCount % 5 == 0? keyboardDisabled = true : keyboardDisabled = false; 

    currentGuess.push(parseInt(playerSelection));
}

function deleteLastSelection() {
    let currentTile = document.querySelector(`[tile="${tileCount}"]`);
    currentTile.classList.remove('tile__played');
    currentTile.innerHTML = '';
    tileCount -= 1;
    currentGuess.pop();
    keyboardDisabled = false;
}

function convertIntervalToFrequency(interval) {
    interval = parseInt(interval) - 9;
    let frequency = A_440 * (Math.pow(Math.pow(2, 1/12), interval));
    return parseFloat(frequency.toFixed(2));
}


function checkAnswer(guesses) {
    // 1 = right note right location
    // 2 = right note wrong location
    let checks = [];
    let melody = todaysMelody.answer;
    for (i = 0; i < guesses.length; i++) {

        // guess equals note in that position
        if (guesses[i] == melody[i]) {
            checks.push("tile__correct");
        }
        else if (melody.indexOf(guesses[i]) > -1) {
            checks.push("tile__wrong_loc");
        }
        else {
            checks.push("tile__wrong");
        }
    }
    return [guesses.toString() == melody.toString(), checks];
}


function winner() {
    document.getElementById('successModal').style.display = 'initial';
}


