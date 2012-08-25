$(function() {
	//Background Width settings
	createRadioSetting('widthMode','automatic','background-width-settings');

	//image effects
	createImageEffect('grayscale', 0, 0,1,0.05, "Grayscale");
	createImageEffect('sepia', 0, 0,1,0.05, "Sepia");
	createImageEffect('hue', 0, 0,360,20, "Hue");
	
	//dialog 
		$('#launchImageEffets').button().click(function(){$("#imageEffects").dialog("open");initializeImageEffects();});
		$("#imageEffects").dialog({ autoOpen: false, width: "300",height: "290",buttons: {
		Close: function() {
			$( this ).dialog( "close" );
		}
	}});
	
	if (!localStorage['transparency']) {
		localStorage['transparency'] = 0.85;
	}
	$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
	$( '#transparency_settings' ).slider({
			value:localStorage['transparency'],
			min: 0,
			max: 1,
			step: .05,
			slide: function(event, ui) {
				localStorage['transparency'] = ui.value;
				$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
			}
	});
});

function createRadioSetting(setting, defaultValue, radioDiv) {
	if (!localStorage[setting]) {
		localStorage[setting] = defaultValue;
	}
	$( '#' + radioDiv ).buttonset();
	$('#' + radioDiv + ' input').click(function() { localStorage[setting] = $(this).attr("id");});
	$('#' + localStorage[setting]).next().addClass("ui-state-active");
}

function createImageEffect(setting, defaultValue, minValue, maxValue, increment,humanReadable) {
	$( '#' + setting + '_effect' ).before('<span class="humanReadable">'+humanReadable+':</span>').slider({
			value:JSON.parse(localStorage['base64'])[setting],
			min: minValue,
			max: maxValue,
			step: increment,
			slide: function(event, ui) {
				var currentBackground = JSON.parse(localStorage['base64']);
				currentBackground[setting] = ui.value;
				localStorage['base64'] = JSON.stringify(currentBackground);
				display_current_picture();
			}
	}).after('<br>');
}
