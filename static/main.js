var objHover = null;
var dragCourse = null;
var currentCourse = null;
var testudoLink = "https://app.testudo.umd.edu/soc/search?courseId=";
var testudoAttr = "			&sectionId=&termId=201901&_openSectionsOnly=on&creditCompare=&credits=&courseLevelFilter=ALL&instructor=&_facetoface=on&_blended=on&_online=on&courseStartCompare=&courseStartHour=&courseStartMin=&courseStartAM=&courseEndHour=&courseEndMin=&courseEndAM=&teachingCenter=ALL&_classDay1=on&_classDay2=on&_classDay3=on&_classDay4=on&_classDay5=on";
var activeInput = null;
var options = null;
var depts = ["AASP", "AAST", "ANGR", "AMSC", "AMST", "ANSC", "ANTH", "AOSC", "ARAB", "ARCH", "AREC", "ARHU"];
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
		.text("Credits: 0")
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
		closeOptions();
		if (activeInput != null) {
			activeInput.blur();
			activeInput = null;
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
			if (activeInput == null) {
				activeInput = $(this);
				openOptions();
			}
		})
		.focusout(function(e) {
			console.log("lost focus");
			if (!selectedOption) { // we clicked outside, not on an option
				console.log("activeinput is now null");
				closeOptions();
				activeInput = null;
			}
			else {
				console.log("selected an option, return focus");
			}
		})
		.keydown(function(e) {
			if(e.keyCode == 13) {
				insertNewCourse($(this).val(), $("input").index($(this)))
				$(this).val("");
			}
			else {
				deptOptions()
			}
		});
	return $("<div/>").attr("class", "courseinput").append(input);
}

function openOptions() {
	options = $("<div/>").attr("class", "options");
	activeInput.after(options);
	deptOptions();
}

function closeOptions() {
	if (activeInput != null && options != null) {
		activeInput.val("");
		options.remove();
		options = null;
	}
}

function deptOptions() {
	if (options != null) {
		for (var i = 0; i < depts.length; i++) {
			var txtoption = $("<div/>")
				.text(depts[i] + " - desc")
				.attr("class", "option")
				.attr("id", depts[i])
				.mousedown(function() {
					selectedOption = true;
					closeOptions();
					activeInput.val($(this).attr("id"));
					setTimeout(function(){
						activeInput.get(0).focus();
						selectedOption = false;
					}, 1);
					courseOptions();
				})
			options.append(txtoption);
		}
	}
}

function courseOptions() {
	options = $("<div/>").attr("class", "options");
	activeInput.after(options);
	for (var i = 0; i < courses.length; i++) {
		var txtoption = $("<div/>")
			.text(courses[i] + " - desc")
			.attr("class", "option")
			.attr("id", courses[i])
			.mousedown(function() {
				selectedOption = true;
				closeOptions();
				activeInput.val($(this).attr("id"));
				setTimeout(function(){
					activeInput.get(0).focus();
					selectedOption = false;
				}, 1);
			})
		options.append(txtoption);
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

function moveCourseTo(before, course) {
	if (before.parent().children(".course").length == 9) {
		alert("10 courses a semester? nonono");
	}
	else {
		course.insertAfter(before);
	}
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
			moveCourseTo(objHover, dragCourse);
			objHover.css({"border-bottom":""});
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