$(function() {
	$("img.help").click(function() {
		$("#"+$(this).attr("for")).slideToggle(300);
	});
	$(".help-description").each(function() {
		$(this).prepend('<img class="help-close" style="margin-right: 5px;" src="icons/close.png">');
		$(this).find('.help-close').click(function() {
			$(this).parent().slideToggle(300);
		});		
	});
});