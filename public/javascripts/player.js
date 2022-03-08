function convertIntervalsToSeq(intervals) {
    let seqArray = [];
    for (i = 0; i < intervals.length; i++) {
        seqArray.push(convertIntervalToFrequency(intervals[i]));
    }

    return seqArray;
}

function playSequence(intervals) {

    if (Tone.context.state !== 'running') {
        console.log('starting player');
        Tone.context.resume();
    }

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now()

    intervals = convertIntervalsToSeq(intervals);
    console.log(intervals);

    for (i = 0; i < intervals.length; i++) {
        if (i == 0) {
            synth.triggerAttackRelease(intervals[i], "8n", now)
        }
        else {
            synth.triggerAttackRelease(intervals[i], "8n", now + (i / 2))
        }
    }
};