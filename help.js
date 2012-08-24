$(function() {
	$("img.help").click(function() {
		$("#"+$(this).attr("for")).slideToggle(300);
	});
	$(".help-description").each(function() {
		$(this).click(function() {$(this).slideUp();});
		$(this).prepend('<img class="help-close" style="margin-right: 5px;" src="icons/close.png">');
		$(this).find('.help-close').click(function() {
			$(this).parent().slideToggle(300);
		});		
	});
	
	if (!localStorage.dragHelp) {
		localStorage.dragHelp = 1;
		noty({
				text: 'Did you know you can drop pictures inside the dashed region from your computer to add a new Facebook background?',
				layout: "center",
				type: 'success',
				timeout: 3000,
			  buttons: [
			  {text: 'More Information', onClick: function() {chrome.tabs.create({url: 'http://www.dansilver.info'}); }},
			  {text: 'Ok', onClick: function($noty) {$noty.close();}}			  
			  ]
	});	
	}
});