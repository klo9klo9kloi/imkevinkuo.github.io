var taps = []
var recording = 0;
var bpm = 0;
var beat = 0;
var metronome;

$(document).ready(function () {
	$("#bpm").click(startBPM);
	$("#notate").click(startNotation);
	$("#test").click(test);
});

function startBPM() {
	if (recording == 0) {
		recording = 1;
		$("#infobox").text("BPM Tracking will start on your first spacebar tap.");
		$("#bpm").text("Click here once you are done");
		$("#bpm").click(stopRecording);
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
	}
}

function displayBeat() {
	$("#infobox").text((beat++)%4 + 1);
}

function startNotation() {
	if (recording == 0) {
		if (bpm > 0) {
			var interval = Math.round(60000/bpm);
			recording = 1;
			beat = 0;
			taps = [];
			$("#infobox").text("Rhythm Notation will start on your first spacebar tap.");
			$(window).keypress(function( event ) {
				if (event.which == 32) { // Spacebar
					if (taps.length == 0) {
						metronome = setInterval(function() {
							displayBeat();
						}, interval);
						setTimeout(function(){
							stopRecording();
							$("#infobox").text("Notes logged, sending to backend.");
							clearInterval(metronome);
							console.log(taps);
						}, interval*32); // 
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

function test() {
	$.ajax({
		url: "https://imkevinkuo.github.io/assets/py/rhythm.py",
		success: function(response) {
			console.log(response);
			// here you do whatever you want with the response variable
		}
	});
	$.ajax({
		type:'get',
		url:<YOUR SERVERSIDE PAGE URL>,
		cache:false,
		data:<if any arguments>,
		async:asynchronous,
		dataType:json, //if you want json
		success: function(data) {
			<put your custom validation here using the response from data structure >
		},
		error: function(request, status, error) {
			<put your custom code here to handle the call failure>
		}
	});
});
}