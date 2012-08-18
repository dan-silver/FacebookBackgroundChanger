function server_save_background() {
	if (localStorage['sharingMode'] == 'private') return;
	console.log('saving to server');
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/fbBackgroundChanger/sharedBackgrounds/saveBackground.php',
		dataType : 'json',
			data: {
				"FacebookID" : localStorage['FacebookID'],
				"background" : localStorage['base64']
			}
	});
}

$(function() {
	createRadioSetting('sharingMode', 'private', 'sharing-settings');
});