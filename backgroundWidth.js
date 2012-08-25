$(function() {
	//Background Width settings
	createRadioSetting('widthMode','automatic','background-width-settings');
	
	//Transparency settings
	createRangeSetting('transparency', 0.85, 'transparency_settings',0,1,0.05,transparencyCallback);
	
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
	if (callback) callback(); //initialize defaults
	if (!localStorage[setting]) {
		localStorage[setting] = defaultValue;
	}
	$( '#' + rangeDivID ).slider({
			value:[setting],
			min: minValue,
			max: maxValue,
			step: increment,
			slide: function(event, ui) {
				if (callback) callback(ui.value);
			}
	});
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
