var BLOG_REPO = "https://raw.githubusercontent.com/imkevinkuo/blog/master/";
var converter = new showdown.Converter()

var LATEST_POST = 0;
var blog = null;

function insertBlogPost(i){
	$.ajax({
		type: "GET",
		url: BLOG_REPO + i + ".md",
		dataType: "text",
		success: function(data) {
			html = converter.makeHtml(data);
			var blogpost = document.createElement('div');
			blogpost.classList.add("blogpost");
			blogpost.innerHTML = html;
			blog.appendChild(blogpost);
		}
	});
}

function getLatestPost() {
	$.ajax({
		type: "GET",
		url: BLOG_REPO + "latest_post.txt",
		async: false,
		dataType: "text",
		success: function(data) {
			LATEST_POST = parseInt(data);
		}		
	});
}	

$( document ).ready(function() {
    // HTML Anchor Smooth Scroll
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - 64
		}, 500, "swing");
	});
	
	// Icons below profile pic
	$("a > i").on("mouseenter", function(event) {
		$("#icon-desc").text($(event.target).attr("hovertext"));
	});
	
	$("a > i").on("mouseout", function(event) {
		$("#icon-desc").text("");
	});
	
	// Create blog posts
	blog = document.getElementById('blog');
	for (var i = LATEST_POST; i >= 0; i--) {
		insertBlogPost(i);
	}
});