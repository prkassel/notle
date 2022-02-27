let tileCount = 0;
let playerTurn = 0;
let flatToggled = false;
let keyboardDisabled = false;

let currentGuess = [];

const todaysMelody = {
    "answer": [0,0,7,7,9],
    "revealMelody": []
};


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var volume = audioCtx.createGain();
volume.connect(audioCtx.destination);


const A_440 = 440;
const notesList = [
    ["C"],
    ["C&#9839;", "D&#9837;"],
    ["D"],
    ["D&#9839;", "E&#9837;"],
    ["E"],
    ["F"],
    ["F&#9839;", "G&#9837;"],
    ["G"],
    ["G&#9839;", "A&#9837;"],
    ["A"],
    ["A&#9839;", "B&#9837;"],
    ["B"]
]


document.getElementById('keyboard').addEventListener('mousedown', function(e) {
    let playerSelection = e.target.getAttribute('note');
    
    if (playerSelection == 'submit') {
        keyboardDisabled? playerGuess() : alert('not enough notes');
    }

    else if (playerSelection == 'delete') {
        if (tileCount > 0 && tileCount % 5 > 0) {
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
        console.log(loc)
        let guessTile = document.querySelector(`[tile="${loc}"]`);
        console.log(guessTile);
        guessTile.classList.add(results[1][i]);
    }
    

    // last thing is delete the current guesses
    currentGuess = [];
}

function toggleKeyboard() {

    let flats = document.getElementsByClassName('flat');
    let sharps = document.getElementsByClassName('sharp');

    if (flatToggled) {
        Array.from(sharps).forEach(function(sharp) {
            sharp.style.display = 'initial';
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
            flat.style.display = 'initial';
        });

        flatToggled = true;
    }

}

function playerSelect(playerSelection) {

    let noteNames = playerSelection >= 12? notesList[playerSelection - 12]: notesList[playerSelection];

    frequency = convertIntervalToFrequency(playerSelection);
   
    // play the tone they selected
    playPlayerSelection(frequency)

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


function playPlayerSelection(frequency) {
    

// create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.connect(volume);
    volume.gain.value=0.000005;
    oscillator.start();
    

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
      
      delay(1000).then(() => oscillator.stop());
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


// right note, but wrong place OR wrong octave
