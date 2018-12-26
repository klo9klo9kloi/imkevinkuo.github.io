var objHover = null;
var dragCourse = null;
var currentCourse = null;
var testudoLink = "https://app.testudo.umd.edu/soc/search?courseId=";
var testudoAttr = "			&sectionId=&termId=201901&_openSectionsOnly=on&creditCompare=&credits=&courseLevelFilter=ALL&instructor=&_facetoface=on&_blended=on&_online=on&courseStartCompare=&courseStartHour=&courseStartMin=&courseStartAM=&courseEndHour=&courseEndMin=&courseEndAM=&teachingCenter=ALL&_classDay1=on&_classDay2=on&_classDay3=on&_classDay4=on&_classDay5=on";
var activeInput = null;
var options = null;
var depts = ["CMSC", "MATH", "AMSC", "STAT", "xd", "xd", "xd", "more xd", "xd", "xd", "xd", "more xd"];

// INPUT NEEDS AUTOCOMPLETE - SHOW FULL COURSE NAME

// MATCH CREDITS TO COURSE
// SUM CREDITS IN HEADER

// COURSE INFO
// GRADUATION REQUIREMENTS

function createSem() {
	var newHeader = $("<div/>")
		.attr("class", "semheader")
		.text("Credits: 0")
		.mouseenter(function() {
			moveIndicator($(this));
		})
		.prepend(createDelButton())
		.append(createCredits());
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

function createCourseForm() {
	return $("<input/>")
		.attr("type", "text")
		.attr("placeholder", "Add course...")
		.keydown(function(e) {
			if(e.keyCode == 13) {
				newCourse = createCourse($(this).val());
				if (newCourse != null) {
					insertCourseAfter($(this).parent(), newCourse);
					closeOptions();
					activeInput.blur();
					activeInput = null;
				}
			}
			else {
				deptOptions()
			}
		});
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
			else {
				p.parent().remove();
			}
		});
}

function createCredits(i) {
	return $("<span/>")
		.attr("class", "credits")
		.text(i);
}

function moveIndicator(elem) {
	if (dragCourse != null) {
		if (objHover != null) {
			objHover.css({"border-bottom":""});
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
	}
}

function releaseCourse() {
	if (dragCourse != null) {
		if (objHover == null) {
			courseInfo(dragCourse.text().slice(1,-1));
		}
		else {
			insertCourseAfter(objHover, dragCourse);
			objHover.css({"border-bottom":""});
		}
		dragCourse.css({"opacity":""});
		dragCourse = null;
		objHover = null;
	}
}

function insertCourseAfter(before, course) {
	if (before.parent().children(".course").length == 9) {
		alert("10 courses a semester? You cray!");
	}
	else {
		course.insertAfter(before);
	}
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

function openOptions() {
	options = $("<div/>").attr("class", "options");
	activeInput.after(options);
	deptOptions();
}

function closeOptions() {
	activeInput.val("");
	options.remove();
	options = null;
}

function deptOptions() {
	if (options != null) {
		options.children().remove();
		for (var i = 0; i < depts.length; i++) {
			var txtoption = $("<div/>")
				.text(depts[i])
				.attr("class", "option")
				.mousedown(function() {
					closeOptions();
					activeInput.val($(this).text());
					console.log(activeInput);
					setTimeout(function(){
						activeInput.get(0).focus();
					}, 1);
					courseOptions();
				})
			options.append(txtoption);
		}
	}
}

function courseOptions() {
	console.log("showing courses");
}

$(document).ready(function () {
	//
	// Add new sem
	$(".newsem").click(function() {
		newSem = createSem();
		newSem.insertBefore($(this).parent());
		$('.main').animate({
			scrollLeft: $(".newsem").offset().left
		});
	});
	//
	// Course dragging
	// REMOVE LATER
	$(".course").mousedown(function() {
		$(this).css({"opacity":0.5});
		dragCourse = $(this);
	})
	$(document).mouseup(function() {
		releaseCourse();
	})
	//
	// Course new placement
	// REMOVE LATER
	$(".sembox, .course, input").mouseenter(function() {
		moveIndicator($(this));
	});
	// Initialization
	// REMOVE LATER
	$(".semheader, .course")
		.prepend(createDelButton())
		.append(createCredits(0));
	$(".sembox").mouseleave(function(e) {
		if(e.relatedTarget) {
			if (objHover != null) {
				objHover.css({"border-bottom":""});
			}
			objHover = null;
		}
	});
	//
	// Remove sem/course
	// REMOVE LATER
	$(".delete").click(function() {
		var p = $(this).parent();
		if (p.attr("class") == "course") {
			p.remove();
		}
		else {
			p.parent().remove();
		}
	});
	//
	// Course form
	// REMOVE LATER
	$("input").keydown(function(e) {
		// check data, show autocomplete
		if(e.keyCode == 13) {
			newCourse = createCourse($(this).val());
			if (newCourse != null) {
				insertCourseAfter($(this).parent(), newCourse);
				closeOptions();
				activeInput.blur();
				activeInput = null;
			}
		}
		else {
			deptOptions()
		}
	});
	$("input").focusin(function(e) {
		if (activeInput == null) {
			activeInput = $(this);
			openOptions();
		}
	});
	$("input").focusout(function(e) {
		if (options != null) { // we clicked outside, not on an option
			console.log("lost focus");
			closeOptions();
			activeInput = null;
		}
	});
});