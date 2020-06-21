$( document ).ready(function() {
    // HTML Anchor Smooth Scroll
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - 64
		}, 500, "swing");
	});
	
	$("a > i").on("mouseenter", function(event) {
		$("#icon-desc").text($(event.target).attr("hovertext"));
	});
	
	$("a > i").on("mouseout", function(event) {
		$("#icon-desc").text("");
	});
});
