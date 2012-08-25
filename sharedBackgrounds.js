$(function() {
	createRadioSetting('sharingMode', 'sharing-settings');
	
	$("#public").click(function() {
		chrome.extension.sendMessage({server_save_background: "true"});
	});
});