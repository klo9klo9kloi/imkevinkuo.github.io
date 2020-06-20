var NIGHT_MODE = 0;
var skilldesc;
var tooltip;

var CSV_LINK = "https://raw.githubusercontent.com/imkevinkuo/Judgement-of-the-Sun/master/src/com/gmail/kvkkuo/JotS/csv/"

var SKILL_NAMES = [];
var SKILL_DESCS = [];
var SKILL_ICONS = [];
var SKILL_CLIPS = [];
		
var CLASSES = ["duelist", "raider", "assassin", "guardian", "witherknight", "paladin"]

loadSkillData(0);
loadVideoLinks(0);
loadSkillIcons();

function loadSkillData(i) {
	if (i < CLASSES.length) {
		$.ajax({
			type: "GET",
			url: CSV_LINK + CLASSES[i] + ".csv",
			dataType: "text",
			success: function(data) {
				processSkillData(data);
				loadSkillData(i+1);
			}
		});
	}
}

function processSkillData(data, c) {
    var lines = data.split(/\r\n|\n/);

    for (var i = 0; i < lines.length; i++) {
		var tokens = lines[i].split(/\"/);
		if (tokens.length == 5) {
			SKILL_NAMES.push(tokens[1]);
			SKILL_DESCS.push(tokens[3]);
		}
	}
}

function loadVideoLinks(i) {
	if (i < CLASSES.length) {
		$.ajax({
			type: "GET",
			url: CSV_LINK + CLASSES[i] + "_videos.csv",
			dataType: "text",
			success: function(data) {
				processVideoLinks(data);
				loadVideoLinks(i+1);
			}
		});
	}
}

function processVideoLinks(data) {
    var lines = data.split(/\r\n|\n/);

    for (var i = 0; i < lines.length; i++) {
		var tokens = lines[i].split(/\"/);
		if (tokens.length == 3) {
			var vidSrc = "https://drive.google.com/uc?export=download&id=" + tokens[1];
			SKILL_CLIPS.push(vidSrc);
		}
	}
}

function loadSkillIcons() {
	$.ajax({
		type: "GET",
		url: "https://raw.githubusercontent.com/imkevinkuo/Judgement-of-the-Sun/master/src/com/gmail/kvkkuo/JotS/listeners/UpgradeMenu.java",
		dataType: "text",
		success: function(data) {
			processSkillIcons(data);
		}
	});
}

function processSkillIcons(data) {
	var j = 0;
	var lines = data.split(/\r\n|\n/);
    for (var i = 0; i < lines.length; i++) {
		if (j < 96) {
			var item = lines[i].match(/Material\.(.*)\)/);
			if (item != null) {
				SKILL_ICONS.push(item[1]);
				j++;
			}
		}
	}
	// Hardcode some values
	SKILL_ICONS[20] = "RED_POTION";
	SKILL_ICONS[21] = "GREY_POTION";
	SKILL_ICONS[22] = "BLUE_POTION";
	SKILL_ICONS[23] = "GREEN_POTION";
	// Insert icons
	var iconDivs = $(".skillicon");
	for (var i = 0; i < iconDivs.length; i++) {
		var img = $('<img />', { 
			src: "images/jots/skillicons/" + SKILL_ICONS[i] + ".png",
		});
		img.appendTo(iconDivs[i]);
	}
}
		
/* Skillbox colors */
var BACK_COLORS = [[100, 70, 66],
				   [120, 37, 35],
				   [200, 175, 128],
				   [174, 182, 191],
				   [60, 60, 60],
				   [244, 208, 63]];
var ROW_COLORS = [[200, 184, 150],
			      [130, 130, 130],
				  [52, 73, 94],
				  [34, 153, 84],
				  [100, 37, 35	],
				  [230, 230, 230]];

$(document).ready(function () {
	$(".star").click(function() {
		if (!$(this).find("img").hasClass("out")) {
			/* Manage icon graphic */
			$(this).find("img").each(function() {
				var img = $(this);
				if (img.hasClass("active")) {
					img.addClass("out");
					img.removeClass("active");
					setTimeout(function() {
						img.removeClass("out");
						img.addClass("hidden");
					}, 900);
				}
				else {
					setTimeout(function() {
						img.removeClass("hidden");
						img.addClass("active");
					}, 900);
				}
			});
			/* Manage background, maybe change text color? still visible */
			NIGHT_MODE = 1 - NIGHT_MODE;
			if (NIGHT_MODE == 1) {
				setTimeout(function() {
					$(".line").css("background", "-webkit-gradient(linear, 0 0, 100% 0, from(rgb(139, 189, 255)), to(rgb(139, 189, 255)), color-stop(50%, white))");
					$("h1, .descbox p").css("color", "black");
				}, 0);
				$("body").removeClass("night");
				$("body").addClass("day");
			}
			else {
				setTimeout(function() {
					$(".line").css("background", "-webkit-gradient(linear, 0 0, 100% 0, from(black), to(black), color-stop(50%, white))");
					$("h1, .descbox p").css("color", "white");
				}, 0);
				$("body").removeClass("day");
				$("body").addClass("night");
			}
		}
	});
	/* click effect */
	$(".classicon > img, .skillicon > img").mouseup(function(){
        $(this).css("opacity", 1);
    });
    $(".classicon > img, .skillicon > img").mousedown(function(){
        $(this).css("opacity", 0.7);
    });
	$(".classicon > img, .skillicon > img").mouseleave(function(){
        $(this).css("opacity", 1);
    });
	
	/* Class icons */
	$(".classicon").each(function(index) {
		$(this).attr("myID", index+1);
		$(this).css("animation-delay", 1+index*0.1 + "s");
	});
	$(".classicon").click(function() {
		showContent($(this).attr("myID"));
	});
	
	/* Skillmenu animation */
	$(".row.double").each(function(s) {
		if (s > 0) {
			var bc = BACK_COLORS[s-1];
			var rc = ROW_COLORS[s-1];
			$(this).find(".skillbox").each(function(i) {
				$(this).css("background-color", 'rgb(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ')');
				$(this).find(".row").each(function(j) {
					$(this).css("background-color", 'rgb(' + rc[0] + ',' + rc[1] + ',' + rc[2] + ')');
					$(this).css("animation-delay", 0.1*j + "s");
				});
			});
		}
	});
	/* Skill icons */
	tooltip = $("#tooltip");
	$(".skillicon").each(function(index) {
		$(this).attr("myID", index);
		$(this).hover(
			function() {
				tooltip.text(SKILL_NAMES[$(this).attr("myID")]);
				tooltip.css("display", "inline");
			}, function() {
				tooltip.css("display", "none");
			}
		);
	});

	window.onmousemove = function(event) {
		var x = (event.clientX + 16) + 'px',
			y = (event.clientY - 32) + 'px';
		tooltip.css("top", y);
		tooltip.css("left", x);
	};
	
	/* Open and close modal */
	var modal = document.getElementById('myModal');
	$(".close").click(function() {
		hideModal(modal);
	});
	window.onclick = function(event) {
		if (event.target == modal) {
			hideModal(modal);
		}
	};
	$(".skillicon").click(function() {
		displayModal(modal, $(this).attr("myID"));
	});
	/* Modal content */
	skilldesc = $(".skilldesc");
});
function showContent(id) {
	$(".row.double").each(function(i) {
		if (i == id) {
			$(this).removeClass("hidden");
			$(this).find('*').addClass("active");
		}
		else {
			$(this).addClass("hidden");
			$(this).find('*').removeClass("active");
		}
	});
}
function showVideo(id) {
	var vidElement = document.getElementById('vid');
	vidElement.src = SKILL_CLIPS[id];
	vidElement.style.opacity = 0;
	vidElement.onloadedmetadata = function(d) {
		vidElement.style.opacity = 1;
		setTimeout(function() {
			vidElement.play();
		}, 500);
	};
	vidElement.ontimeupdate = function(e) {
		if (this.duration - this.currentTime <= .5) {
			vidElement.style.opacity = 0;
		}
	};
}
function displayModal(modal, i) {
	modal.classList.remove("hidden");
	modal.classList.add("active");
	/* Change text inside modal */
	skilldesc.find("h2").text(SKILL_NAMES[i]);
	skilldesc.find("p").text(SKILL_DESCS[i]);
	showVideo(i);
}
function hideModal(modal) {
	modal.classList.remove("active");
	setTimeout(function() {
		modal.classList.add("hidden");
	}, 400);
	$("video").each(function () { this.pause() });
}