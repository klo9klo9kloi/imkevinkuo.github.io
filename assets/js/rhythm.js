var taps = []
var recording = 0;
var bpm = 0;
var interval = 0;
var beat = 0;
var beating = 0;
var metronome;
var NOTE_TYPES = [4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25, 0.33, 0.66];

$(document).ready(function () {
	$("#bpm").click(startBPM);
	$("#notate").click(startNotation);
});

function startBPM() {
	if (recording == 0) {
		recording = 1;
		stopBeat();
		$("#infobox").text("BPM Tracking will start on your first spacebar tap.");
		$("#bpm").text("Click here once you are done");
		$("#bpm").unbind("click").click(stopRecording);
		// Should switch to implemention of queue
		var lastTap = 0;
		var intervalSum = 0; // intervalSum/totalTaps = averageInterval
		var totalTaps = 0;
		$(window).keypress(function( event ) {
			if (event.which == 32) { // Spacebar
				totalTaps += 1;
				if (totalTaps > 1) {
					intervalSum += event.timeStamp - lastTap;
					bpm = Math.round(60000/(intervalSum/totalTaps));
					interval = Math.round(60000/bpm);
					$("#infobox").text(bpm); // 60000ms in 1 minute
				}
				lastTap = event.timeStamp;
			}
		});
	}
}

function stopRecording() {
	if (recording == 1) {
		recording = 0;
		$(window).unbind("keypress");
		displayBeat();
		$("#bpm").text("BPM saved. Click to re-record.");
		$("#bpm").unbind("click").click(startBPM);
	}
}

function displayBeat() {
	if (bpm > 0 && beating == 0) {
		beat = 0;
		beating = 1;
		$("#beat").unbind("click").click(stopBeat);
		$("#beat").text("stop counting beats");
		metronome = setInterval(function() {
			$("#counter").text((beat++)%4 + 1);
		}, interval);
	}
}

function stopBeat() {
	if (beating == 1) {
		beating = 0;
		$("#beat").unbind("click").click(displayBeat);
		$("#beat").text("show beats again");
		clearInterval(metronome);
	}
}

function startNotation() {
	if (recording == 0) {
		if (bpm > 0) {
			recording = 1;
			taps = [];
			$("#infobox").text("Rhythm Notation will start on your first spacebar tap.");
			$(window).keypress(function( event ) {
				if (event.which == 32) { // Spacebar
					if (taps.length == 0) {
						$("#infobox").text("dun ");
						setTimeout(function(){
							recording = 0;
							$(window).unbind("keypress");
							$("#infobox").text("Notes logged, parsing.");
							console.log(taps);
							parseTaps();
						}, interval*32); // 
					}
					else {
						$("#infobox").text("dun ".repeat(taps.length + 1));
					}
					taps.push(event.timeStamp);
				}
			});
		}
		else {
			$("#infobox").text("Please set BPM first.");
		}
	}
}

function parseTaps() {
	var notes = [];
	var delays = [];
	for (var i = 1; i < taps.length; i++) {
		delays.push(taps[i] - taps[i-1]);
	}
	for (var i = 0; i < taps.length; i++) {
		notes.push(closestNote(delays, i, interval, 0));
	}
	console.log(notes);
}

function findMin(array) {
	if (array.length > 0) {
		minIndex = 0;
		minimum = array[0];
		for (var i = 1; i < array.length; i++) {
			if (array[i] < minimum) {
				minIndex = i;
				minimum = array[i];
			}
		}
		return [minIndex, minimum];
	}
	return [-1, -1];
}

function closestNote(delays, i, interval, tupleCheck) {
	var time = delays[i];
	var ratio = time/interval;
	var differences = NOTE_TYPES.slice();
	for (var i = 0; i < differences.length; i++) {
		differences[i] = Math.abs(differences[i] - ratio);
	}
	
	m = findMin(differences);
	var minIndex = m[0];
	var minimum = m[1];
	if (NOTE_TYPES[minIndex] == 0.33 || NOTE_TYPES[minIndex] == 0.66) {
		if (tupleCheck == 0 && i < delays.length) {
			var second = closestNote(delays, i+1, interval, 1);
			var third = closestNote(delays, i+2, interval, 1);
			if (minimum != second && minimum != third) {
				minIndex = findMin(differences.slice(0, -2));
			}
			else {
				delays[i+1] = delays[i];
                delays[i+2] = delays[i];
			}
		}
	}
	return NOTE_TYPES[minIndex];
}