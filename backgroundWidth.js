$(function() {
	createRadioSetting('widthMode','automatic','background-width-settings');
});

function createRadioSetting(setting, defaultValue, radioDiv) {
	if (!localStorage[setting]) {
		localStorage[setting] = defaultValue;
	}
	$( '#' + radioDiv ).buttonset();
	$('#' + radioDiv + 'input').click(function() { localStorage[setting] = $(this).attr("id");});
	$("#" + localStorage[setting]).next().addClass("ui-state-active");
}