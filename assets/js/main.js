var current = 0;
$(function() {
	$.scrollify({
		section : ".section",
		easing: "easeOutExpo",
		scrollSpeed: 1200,
		updateHash: false,
		scrollbars: false,
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
	$(".section").eq(s).find('*').addClass("active nohover");
	setTimeout(function() {
		$(".section").eq(s).find('*').removeClass("nohover");
	}, 1000);
}
function deactivate(s) {
	$(".section").eq(s).find('*').removeClass("active");
	$(".section").eq(s).find('h1').text($(".section").eq(s).find('.row.imgs').attr("desc"));
}
function shadeBG() {
	var s = $(this).scrollTop();
	var sSize = $(document).height()/4;
	var grey = [160, 160, 160];
	var red = [244, 164, 164];
	var blu = [128, 191, 255];
	var grn = [64, 191, 128];
	var rgb = [0, 0, 0];
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
/* maybe store id as attribute and use ids as indices for array in js */
$(document).ready(function () {
	$(".row.imgs").mouseleave(function() {
		if ($(this).hasClass("active")) {
			$(".section").eq(current).find('h1').text($(this).attr("desc"));
		}
	});
	
	$(".imgbox").mouseenter(function() {
		if (!$(this).hasClass("nohover")) {
			$(".section").eq(current).find('h1').text($(this).attr("desc"));
		}
	});
	
	for (var s = 0; s < 4; s++) {
		$(".section").eq(s).find('.row .imgbox').each(function(index) {
			$(this).css("animation-delay", index*0.075 + "s");
		});
	}
});
$(window).on('load', function() {
	setTimeout(function() {
		$.scrollify.instantMove(0);
	});
});
$(document).scroll(function() {
	shadeBG();
});
/*
$( window ).resize(function() {
	$.scrollify.move(0);
});
*/