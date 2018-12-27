var objHover = null;
var dragCourse = null;
var currentCourse = null;
var testudoLink = "https://app.testudo.umd.edu/soc/search?courseId=";
var testudoAttr = "			&sectionId=&termId=201901&_openSectionsOnly=on&creditCompare=&credits=&courseLevelFilter=ALL&instructor=&_facetoface=on&_blended=on&_online=on&courseStartCompare=&courseStartHour=&courseStartMin=&courseStartAM=&courseEndHour=&courseEndMin=&courseEndAM=&teachingCenter=ALL&_classDay1=on&_classDay2=on&_classDay3=on&_classDay4=on&_classDay5=on";
var activeInput = null;
var options = null;
var depts = ["AASP", "AAST", "ANGR", "AMSC", "AMST", "ANSC", "ANTH", "AOSC", "ARAB", "ARCH", "AREC", "ARHU", "CMSC"];
var courses = ["CMSC101", "CMSC102", "CMSC103", "CMSC104", "CMSC105", "CMSC106", "CMSC107", "CMSC108", "CMSC109", "CMSC901", "CMSC999"];
var selectedOption = false;

// INPUT NEEDS AUTOCOMPLETE - SHOW FULL COURSE NAME

// MATCH CREDITS TO COURSE
// SUM CREDITS IN HEADER

// COURSE INFO
// GRADUATION REQUIREMENTS

function insertNewSem() {
	newSem = createSem();
	newSem.insertBefore($(".newbox"));
	$('.main').animate({
		scrollLeft: $(".newsem").offset().left
	});
}
function createSem() {
	var newHeader = $("<div/>")
		.attr("class", "semheader")
		.text("Sem. Credits")
		.prepend(createDelButton())
		.append(createCredits(0));
	var newSem = $("<div/>")
		.attr("class", "sembox")
		.mouseenter(function() {
			moveIndicator($(this));
		})
		.mouseleave(function(e) {
			if(e.relatedTarget) {
				if (objHover != null) {
					objHover.css({"border-bottom":""});
				}
				objHover = null;
			}
		})
		.prepend(createCourseForm())
		.prepend(newHeader);
	return newSem;
}

function insertNewCourse(name, semIndex) {
	var cinput = $(".courseinput").eq(semIndex);
	newCourse = createCourse(name);
	if (newCourse != null) {
		moveCourseTo(cinput, newCourse);
		if (activeInput != null) {
			activeInput.blur(); // automatically triggers closeOptions();
		}
	}
}
function createCourse(txt) {
	if (txt == "") { // Need some backend checks
		return null;	
	}
	return $("<div/>")
		.attr("class", "course")
		.text(txt)
		.mouseenter(function() {
			moveIndicator($(this));
		})
		.mousedown(function() {
			$(this).css({"opacity":0.5});
			dragCourse = $(this);
		})
		.prepend(createDelButton())
		.append(createCredits(0));
}

function createDelButton() {
	return $("<span>&times;</span>")
		.attr("class", "delete")
		.click(function() {
			var p = $(this).parent();
			if (p.attr("class") == "course") {
				p.remove();
			}
			else { // header parent -> sembox delete
				p.parent().remove();
			}
		})
		.mousedown(function(e) {
			$(this).css("color", "red");
			e.stopPropagation();
		})
		.mouseleave(function(e) {
			$(this).css("color", "");
		});
}

function createCredits(i) {
	return $("<span/>")
		.attr("class", "credits")
		.text(i);
}

function createCourseForm() {
	var input = $("<input/>")
		.attr("type", "text")
		.attr("placeholder", "Select department...")
		.mouseenter(function() {
			moveIndicator($(this));
		})
		.focusin(function(e) {
			if (activeInput == null) { // don't trigger again after selection dept
				activeInput = $(this);
				openOptions();
				displayOptions($(this).val().toUpperCase());
			}
		})
		.focusout(function(e) {
			if (!selectedOption) { // we clicked outside, not on an option
				closeOptions();
			}
		})
		.keydown(function(e) {
			if(e.keyCode == 13) {
				if (options != null) {
					insertNewCourse($(this).val(), $("input").index($(this)))
					$(this).val("");
				}
			}
		})
		.on('input', function() {
			displayOptions($(this).val().toUpperCase());
		});
	return $("<div/>").attr("class", "courseinput").append(input);
}

function openOptions() {
	options = $("<div/>").attr("class", "options");
	activeInput.after(options);
}

function closeOptions() {
	activeInput.val("");
	options.remove();
	options = null;
	activeInput = null;
}

function displayOptions(query) {
	var optionList = null;
	var count = 0;
	options.empty();
	if (query.length <= 7) {
		if (query.length >= 4) {
			optionList = courses;
		}
		else {
			optionList = depts;
		}
	}
	for (var i = 0; i < optionList.length; i++) {
		if (optionList[i].startsWith(query)) {
			count++;
			var txtoption = $("<div/>")
				.text(optionList[i])
				.attr("class", "option")
				.attr("id", optionList[i])
				.mousedown(function() {
					console.log("selected option: " + $(this).attr("id"));
					selectedOption = true;
					displayOptions($(this).attr("id"));
					activeInput.val($(this).attr("id"));
					setTimeout(function(){
						activeInput.focus();
						selectedOption = false;
					}, 1);
				})
			options.append(txtoption);
		}
	}
	if (count == 0) {
		count = 1;
	}
	if (count > 9) {
		count = 9;
	}
	options.animate({
		height: 1.77*count + "rem",
	}, 200);
}


function courseInfo(courseId) {
	if (currentCourse != courseId) {
		currentCourse = courseId;
		var url = "https://api.umd.io/v0/courses/" + courseId;
		httpGetAsync(url, 
			function(response) {
				var c = JSON.parse(response);
				var prereq = c['relationships']['prereqs'];
				if (prereq == null) {
					prereq = "None.";
				}
				$("#courseid").text(courseId).attr("href", testudoLink + courseId + testudoAttr);
				$("#coursename").text(c['name']);
				$("#coursedesc").text("Requirements: " + prereq);
			},
			function() {;
				$("#courseid").text(courseId).attr("href", testudoLink + courseId + testudoAttr);
				$("#coursename").text("Could not fetch info.")
				$("#coursedesc").text("");
			}
		);
	}
}

function httpGetAsync(theUrl, callback, backup) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
		}
    }
	xmlHttp.onerror = function() {
		backup();
	}
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function moveCourseTo(before, course) {
	if (before.parent().children(".course").length >= 9) {
		alert("10 courses a semester is a bit much");
	}
	else {
		course.insertAfter(before);
	}
}

function moveIndicator(elem) {
	if (dragCourse != null) {
		if (objHover != null) {
			objHover.css({"border-bottom":""});
			objHover.css({"border-radius":"0.5rem"});
		}
		if (elem.attr("class") == "sembox") {
			if (objHover == null) {
				objHover = elem.children("input, .course").last();
			}
		}
		else {
			objHover = elem;
		}
		objHover.css({"border-bottom":"2px black solid"});
		objHover.css({"border-radius":"0.5rem 0.5rem 0 0"});
	}
}

function releaseCourse() {
	if (dragCourse != null) {
		if (objHover == null) {
			courseInfo(dragCourse.text().slice(1,-1));
		}
		else {
			moveCourseTo(objHover, dragCourse);
			objHover.css({"border-bottom":""});
			objHover.css({"border-radius":"0.5rem"});
		}
		dragCourse.css({"opacity":""});
		dragCourse = null;
		objHover = null;
	}
}

$(document).ready(function () {
	// Initialize stuff for testing
	var init = [["CMSC131", "MATH140", "ENGL101", "ENES210", "GEMS100"], ["CMSC132", "MATH141", "idk", "xd", "GEMS102"]];
	for (var i = 0; i < init.length; i++) {
		insertNewSem();
		for (var j = 0; j < init[i].length; j++) {
			insertNewCourse(init[i][j], i);
		}
	}
	//
	// Make everything work
	$(".newsem").click(function() {
		insertNewSem();
	});
	$(document).mouseup(function() {
		releaseCourse();
	})
});