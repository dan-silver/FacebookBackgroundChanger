$(function() {
	$("#item-options").click(function() {
		if ($("#options-panel").css("display") == "none") {
			$("#options-panel").slideDown();
			$("#item-options img").css("-webkit-transform","rotate(0deg)");
		} else {
			hideOptionsPanel();
		}
	});
	$("#page,#content").click(function(){
		hideOptionsPanel();
	});
	function hideOptionsPanel() {
		$("#options-panel").slideUp(250);
		$("#item-options img").css("-webkit-transform","rotate(180deg)");
	}
	$("#item-reset").click(function() {
		noty({
				layout: "center",
				type: 'success',
				timeout: 3000,
				text: 'This will reset all settings to their default values, similar to when you first installed it on your computer.  You can restore premium background purchases by logging into your Google account.<br><strong>Do you want to reset the extension?</strong>',
				buttons: [{addClass: 'btn btn-danger', text: 'Reset', onClick: function($noty) {
					localStorage.clear();
					chrome.extension.sendMessage({setDefaults: true});
				  }},{addClass: 'btn btn-primary', text: 'Cancel',onClick:function($noty) {$noty.close();}}
				  ]
		});
	});
});