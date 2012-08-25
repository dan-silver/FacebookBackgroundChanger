$(function() {
	createRadioSetting('sharingMode', 'private', 'sharing-settings');
	
	$("#public").click(function() {
		chrome.extension.sendMessage({server_save_background: "true"});
	});
});