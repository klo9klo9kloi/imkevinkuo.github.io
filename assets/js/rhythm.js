var taps = []
var recording = 0;
var bpm = 0;
var interval = 0;
var beat = 0;
var beating = 0;
var metronome;
var keydown = 0;
var NOTE_TYPES = [4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25, 0.33, 0.66];

$(document).ready(function () {
	$("#bpm").click(startBPM);
	$("#notate").click(startNotation);
	$(window).keyup(function(event) {
		keydown = 0;
	})
});
function createRipple() {
	var ripple = $("<div class='ripple'></div>").appendTo("body");
	setTimeout(function(){
		ripple.remove();
	}, 2500); 
}
function startBPM() {
	if (recording == 0) {
		recording = 1;
		stopBeat();
		$("#bpm").text("Tap spacebar to the beat.");
		$("#bpm").unbind("click").click(stopRecording);
		// Should switch to implemention of queue
		var lastTap = 0;
		var intervalSum = 0; // intervalSum/totalTaps = averageInterval
		var totalTaps = 0;
		$(window).keydown(function( event ) {
			if (keydown == 0) {
				keydown = 1;
				if (event.which == 32) { // Spacebar
					createRipple();
					totalTaps += 1;
					if (totalTaps > 1) {
						intervalSum += event.timeStamp - lastTap;
						bpm = Math.round(60000/(intervalSum/totalTaps));
						interval = Math.round(60000/bpm);
						$("#bpm").html("BPM: " + bpm + "<br>Click to lock BPM."); // 60000ms in 1 minute
					}
					lastTap = event.timeStamp;
				}
			}
		});
	}
}

function stopRecording() {
	if (recording == 1) {
		recording = 0;
		$(window).unbind("keydown");
		displayBeat();
		$("#bpm").html("BPM: " + bpm + "<br>Click to record new BPM.");
		$("#bpm").unbind("click").click(startBPM);
	}
}

function displayBeat() {
	if (bpm > 0 && beating == 0) {
		beat = 0;
		beating = 1;
		metronome = setInterval(function() {
			$("#beat").text((beat++)%4 + 1);
		}, interval);
	}
}

function stopBeat() {
	if (beating == 1) {
		beating = 0;
		clearInterval(metronome);
	}
}

function startNotation() {
	if (recording == 0) {
		if (bpm > 0) {
			recording = 1;
			taps = [];
			$("#notate").text("Tap spacebar to begin notating.");
			$(window).keydown(function( event ) {
				if (event.which == 32) { // Spacebar
					createRipple();
					if (taps.length == 0) {
						$("#notate").text("Notating for 8 measures...");
						setTimeout(function(){
							recording = 0;
							$(window).unbind("keydown");
							$("#notate").html("Done! Data in console.<br>Click to record new rhythm.");
							parseTaps();
						}, interval*32);
					}
					taps.push(event.timeStamp);
				}
			});
		}
		else {
			$("#notate").text("Please set BPM first.");
			setTimeout(function(){
				$("#notate").text("2. Tap rhythm");
			}, 1000);
		}
	}
}

function parseTaps() {
	console.log(taps);
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
		return minIndex;
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

	var minIndex = findMin(differences);
	var minNote = NOTE_TYPES[minIndex];
	if (minNote == 0.33 || minNote == 0.66) {
		if (tupleCheck == 0 && i < delays.length) {
			var second = closestNote(delays, i+1, interval, 1);
			var third = closestNote(delays, i+2, interval, 1);
			if (minNote != second && minNote != third) {
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