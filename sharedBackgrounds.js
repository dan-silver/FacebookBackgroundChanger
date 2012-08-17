function server_save_background() {
	if (!localStorage['sharingMode']) return;
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
	$( '#sharing-settings' ).buttonset();
	$('#private').click(function() { localStorage['sharingMode'] = false;});
	$('#public').click(function() { localStorage['sharingMode'] = true; });
	updateSharingModeButtons();
});

function updateSharingModeButtons() {
	if (localStorage['sharingMode']) {
		$('#public').next().addClass("ui-state-active");
	} else {
		$('#private').next().addClass("ui-state-active");
	}
}