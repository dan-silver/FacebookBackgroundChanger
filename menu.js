$(function() {
	$("#item-options").click(function() {
		$("#options-panel").slideToggle();
	});
	$("#page,#content").click(function() {
		$("#options-panel").slideUp();
	});
	$("#item-reset").click(function() {
		noty({
				layout: "center",
				type: 'success',
				timeout: 3000,
				text: 'This will reset all settings to their default values, similar to when you first installed it on your computer.  You can restore premium background purchases by logging into your Google account.<br><strong>Do you want to reset the extension?</strong>',
				buttons: [{addClass: 'btn btn-danger', text: 'Reset', onClick: function($noty) {
					localStorage.clear();
					chrome.extension.sendMessage({setDefaults: true}); //save users Facebook username
				  }},{addClass: 'btn btn-primary', text: 'Cancel',onClick:function($noty) {$noty.close();}}
				  ]
		});
	});
});

/**
		  text: 'This will reset all settings to their default values, similar to when you first installed it on your computer.  If you purchased a premium background, you can always get it back by loggin into your google account.<br>Do you want to reset the extension?',
 
		});
		
**/