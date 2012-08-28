$(function() {
	$("#item-options").click(function() {
		$("#options-panel").slideToggle();
	});
	$("#page,#content").click(function() {
		$("#options-panel").slideUp();
	});
});