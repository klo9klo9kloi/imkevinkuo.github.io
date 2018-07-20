function showContent(id) {
	$(document).find('.row.double').each(function(i) {
		if (i == id) {
			$(this).removeClass("hidden");
		}
		else {
			$(this).addClass("hidden");
		}
	});
}
$(document).ready(function () {
	$(".classicon").click(function() {
		showContent($(this).attr("myID"));
	});
});