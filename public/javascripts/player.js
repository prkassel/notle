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


function convertIntervalsToSeq(intervals) {
    let seqArray = [];
    for (i = 0; i < intervals.length; i++) {
        seqArray.push(convertIntervalToFrequency(intervals[i]));
    }

    return seqArray;
}

function playSequence(intervals) {

    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now()

    intervals = convertIntervalsToSeq(intervals);

    for (i = 0; i < intervals.length; i++) {
        if (i == 0) {
            synth.triggerAttackRelease(intervals[i], "8n", now)
        }
        else {
            synth.triggerAttackRelease(intervals[i], "8n", now + (i / 2))
        }
    }
};