$(function() {
	//Background Width settings
	createRadioSetting('widthMode','background-width-settings');
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
	
	$('#transparency_slider').attr("value", localStorage['transparency']);
	$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
	$('#transparency_slider').change(function() {
		console.log(this.value);
		localStorage['transparency'] = this.value;
		$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
	});
});

function createRadioSetting(setting, radioDiv) {
	$( '#' + radioDiv ).buttonset();
	$('#' + radioDiv + ' input').click(function() { localStorage[setting] = $(this).attr("id");});
	$('#' + localStorage[setting]).next().addClass("ui-state-active");
}
var currentlyEditingbackground;
function createImageEffect(setting, defaultValue, minValue, maxValue, increment,humanReadable) {
	if (!localStorage['base64'] || !JSON.parse(localStorage['base64'])[setting]) {
		var defaultValue = '0';
	} else {
		var defaultValue = JSON.parse(localStorage['base64'])[setting];
	}
	$( '#' + setting + '_effect' ).before('<span class="humanReadable">'+humanReadable+':</span>').slider({
			value:defaultValue,
			min: minValue,
			max: maxValue,
			step: increment,
			start: function() {
				currentlyEditingbackground = JSON.parse(localStorage['base64']);
			},
			slide: function(event, ui) {
				currentlyEditingbackground[setting] = ui.value;
				$("#current-background img").attr("src", "data:image/png;base64, " + currentlyEditingbackground.src).css({
					"-webkit-filter": "hue-rotate("+currentlyEditingbackground.hue+"deg) grayscale("+currentlyEditingbackground.grayscale+") sepia("+currentlyEditingbackground.sepia+")"
				}); 
			},
			stop: function() {
				chrome.extension.sendMessage({server_save_background: "true"});
				localStorage['base64'] = JSON.stringify(currentlyEditingbackground);
			}
	}).after('<br>');
}