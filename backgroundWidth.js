$(function() {
	//Background Width settings
	createRadioSetting('widthMode','automatic','background-width-settings');
	
	//Transparency settings
	$("#transparency_value").html(((Math.round(localStorage['transparency']*100)))+"%");
	createRangeSetting('transparency', 0.85, 'transparency_settings',0,1,0.05,transparencyCallback);
});

function transparencyCallback() {
	$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
}

function createRadioSetting(setting, defaultValue, radioDiv) {
	if (!localStorage[setting]) {
		localStorage[setting] = defaultValue;
	}
	$( '#' + radioDiv ).buttonset();
	$('#' + radioDiv + ' input').click(function() { localStorage[setting] = $(this).attr("id");});
	$('#' + localStorage[setting]).next().addClass("ui-state-active");
}

function createRangeSetting(setting, defaultValue, rangeDivID, minValue, maxValue, increment, callback) {
	if (!localStorage[setting]) {
		localStorage[setting] = defaultValue;
	}
	$( '#' + rangeDivID ).slider({
			value:localStorage[setting],
			min: minValue,
			max: maxValue,
			step: increment,
			slide: function(event, ui) {
				localStorage[setting] = ui.value;
				callback();
			}
	});
}