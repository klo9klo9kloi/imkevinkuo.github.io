var inputAllowed = true;
var descs = [["Kevin Kuo"],
			["Academics", "University of Maryland, College Park", "Team AIMAR", "Thomas Jefferson High School"],
			["Projects", "AI/Parallel Computing", "Gait Recognition", "Elementals", "Cadence", "Web Automation", "4 Year Planner"],
			["Miscellaneous", "Track and Field", "Taiwan", "Music", "League of Legends"]];
function showSection(s) {
	if (s == 0) {
		showContent(s, 0);
	}
	else {
		showContent(s, -1);
	}
	/* need to also animate show/hide */
	$(".section").each(function(i) {
		if (i == s) {
			$(this).removeClass("hidden");
		}
		else {
			$(this).addClass("hidden");
		}
	});
}
function showContent(sec, id) {
	$(".section").eq(sec).find('.content').each(function(i) {
		if (i == id) {
			$(this).removeClass("hidden");
		}
		else {
			$(this).addClass("hidden");
		}
	});
}
$(document).ready(function () {
	
	$(".imgbox").mouseleave(function() {
		var sec = $(".section").index($(this).parent().parent());
		var id = $(this).parent().children(".imgbox").index($(this));
		$(".section").eq(sec).find('h1').text(descs[sec][0]);
		$(this).removeClass("active");
	});
	
	$(".imgbox").mouseenter(function() {
		var sec = $(".section").index($(this).parent().parent());
		var id = $(this).parent().children(".imgbox").index($(this));
		$(".section").eq(sec).find('h1').text(descs[sec][id+1]);
		$(this).addClass("active");
	});
	
	$(".imgbox").mousedown(function() {
		var sec = $(".section").index($(this).parent().parent());
		var id = $(this).parent().children(".imgbox").index($(this));
		showContent(sec, id);
	});
	
	$(".navbutton").mousedown(function() {
		if (inputAllowed) {
			showSection($(".navbutton").index(this));
		}
	});
});