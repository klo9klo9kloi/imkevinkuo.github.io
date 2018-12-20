var inputAllowed = true;
var descs = [[""],
			["Academics", "University of Maryland, College Park", "Team AIMAR", "Thomas Jefferson High School"],
			["Projects", "AI/Parallel Computing", "Gait Recognition", "Elementals", "Cadence", "Web Automation", "4 Year Planner"],
			["About", "Track and Field", "Taiwan", "Music"]];
function showSection(s) {
	if (s > 0) {
		showContent(s, -1);
		$(".section").eq(s).find('h1').each(function() {
			$(this).text(" ");
		})
	}
	$(".section").each(function(i) {
		var sec = $(this);
		if (i == s) { // Display this one
			setTimeout(function() {
				sec.removeClass("hidden");
			}, 500);
			if (s != 0) {
				sec.find(".carousel").eq(0).find(".imgbox").each(function(i) {
					$(this).css({"animation":"fadeInDown 0.50s", "animation-delay":(i*0.05)+"s", "animation-fill-mode":"both"});
				});
			}
		}
		else { // Hide
			if (i == 0) {
				sec.find("#intro").css({"animation":"fadeOutLeft 0.50s", "animation-fill-mode":"forwards"});
				sec.find("#profile").css({"animation":"fadeOutRight 0.50s", "animation-fill-mode":"forwards"});
				sec.find("#info > p").each(function(i) {
					var d = i*0.05;
					$(this).css({"animation":"fadeOutUp " + (0.5-d) + "s", "animation-delay": d+"s", "animation-fill-mode":"both"});
				});
				setTimeout(function() {
					sec.addClass("hidden");
					sec.find("#intro").css({"animation":"", "animation-fill-mode":""});
					sec.find("#profile").css({"animation":"", "animation-fill-mode":""});
					sec.find("#info > p").css({"animation":"", "animation-delay": "", "animation-fill-mode":""});
				}, 500);
			}
			else {// Animate out, then reset and hide section
				sec.find(".carousel").eq(0).find(".imgbox").each(function(i) {
					$(this).css({"animation":"fadeOutLeft 0.50s", "animation-delay":(i*0.05)+"s", "animation-fill-mode":"both"});
				});
				sec.find(".subsection").css({"animation":"fadeOutRight 0.50s", "animation-fill-mode":"both"});
				setTimeout(function() {
					sec.addClass("hidden");
					sec.find(".carousel").eq(0).find(".imgbox").each(function(i) {
						$(this).css({"animation": "", "animation-delay": "", "animation-fill-mode":""});
					});
					sec.find(".subsection").css({"animation": "", "animation-fill-mode":""});
				}, 500);
			}
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
	$(".imgbox").mouseleave(function(e) {
		if(e.relatedTarget) {
			var sec = $(".section").index($(this).parent().parent());
			var id = $(this).parent().children(".imgbox").index($(this));
			$(this).removeClass("active");
		}
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
		$(this).css("opacity", 0.7);
	});
	
	$(".imgbox").mouseup(function() {
		$(this).css("opacity", 1);
	});
	
	$(".navbutton").mousedown(function() {
		if (inputAllowed) {
			showSection($(".navbutton").index(this));
		}
	});
});