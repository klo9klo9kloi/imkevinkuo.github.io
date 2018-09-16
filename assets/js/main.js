var current = 0;
var descs = [["Kevin Kuo"],
			["Academics", "University of Maryland, College Park", "Team AIMAR", "Thomas Jefferson High School"],
			["Projects", "AI/Parallel Computing", "Gait Recognition", "Elementals", "Cadence", "kirilloid-oasis"],
			["Miscellaneous", "Track and Field", "Taiwan", "Music", "League of Legends"]];
$(function() {
	$.scrollify({
		section : ".section",
		easing: "easeOutExpo",
		scrollSpeed: 1200,
		updateHash: true,
		scrollbars: false,
		afterResize: function() {
			$.scrollify.update();
			$.scrollify.instantMove(current);
		},
		before: function(i, panels) {
			current = i;
			for (var s = 0; s < 4; s++) {
				if (s == i) {
					activate(s);
				}
				else {
					deactivate(s);
				}
			}
			
			$(".pagination .active").removeClass("active");
			$(".pagination").find("li").eq(i).addClass("active");
		},
		afterRender:function() {
			var pagination = "<ul class=\"pagination\">";
			var activeClass = "";
			$(".section").each(function(i) {
				activeClass = "";
				if(i===0) {
					activeClass = "active";
				}
				pagination += "<li class=\"" + activeClass + "\"></li>";
			});

			pagination += "</ul>";

			$("#home").append(pagination);

			$(".pagination li").on("click",function() {
				$.scrollify.move($("li").index($(this)));
			});
		}
	});
});
function activate(s) {
	if (s > 0) {
		var imgboxes = $(".section").eq(s).find('.imgbox');
		showContent(s, -1);
		$(".section").eq(s).find('*').each(function(index) {
			$(this).addClass("active");
		});
		imgboxes.addClass("nohover");
		setTimeout(function() {
			imgboxes.removeClass("nohover");
		}, imgboxes.length * 200 + 1000);
		$(".section").eq(s).find('h1').text(descs[s][0]);
	}
}
function deactivate(s) {
	$(".section").eq(s).find('*').removeClass("active");
}
function shadeBG() {
	var s = $(this).scrollTop();
	var sSize = $(document).height()/4;
	var grey = [160, 160, 160];
	var red = [244, 164, 164];
	var blu = [128, 191, 255];
	var grn = [64, 191, 128];
	var rgb = [64, 191, 128];
	if (s/sSize <= 1) {
		var r = (s/sSize); // r: ratio. will range from 0 to 1
		for (var i = 0; i < 3; i++) {
			rgb[i] = grey[i] + (red[i]-grey[i])*r;
		}
	}
	else if (s/sSize <= 2) {
		var r = (s/sSize) - 1;
		for (var i = 0; i < 3; i++) {
			rgb[i] = red[i] + (blu[i]-red[i])*r;
		}
	}
	else if (s/sSize <= 3) {
		var r = (s/sSize) - 2;
		for (var i = 0; i < 3; i++) {
			rgb[i] = blu[i] + (grn[i]-blu[i])*r;
		}
	}
	$("body").css('background-color', 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
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
		var sec = $(this).attr("mySection");
		var id = $(this).attr("myID");
		$(".section").eq(sec).find('h1').text(descs[sec][0]);
	});
	
	$(".imgbox").mouseenter(function() {
		var sec = $(this).attr("mySection");
		var id = $(this).attr("myID");
		$(".section").eq(sec).find('h1').text(descs[sec][id]);
	});
	
	$(".imgbox").mousedown(function() {
		if (!$(this).hasClass("nohover")) {
			var sec = $(this).attr("mySection");
			var id = $(this).attr("myID") - 1;
			showContent(sec, id);
			$(this).css("opacity", 0.7);
		}
	});
	
	$(".imgbox").mouseup(function() {
		if (!$(this).hasClass("nohover")) {
			$(this).css("opacity", '');
		}
	});
	
	for (var s = 0; s < 4; s++) {
		$(".section").eq(s).find('.row .imgbox').each(function(index) {
			$(this).css("animation-delay", 0.2 + index*0.2 + "s");
		});
	}
});
$(document).scroll(function() {
	shadeBG();
});