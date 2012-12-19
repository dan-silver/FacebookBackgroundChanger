$(function() {
	//image effects
	createImageEffect('grayscale', 0, 0,1,0.05, "Grayscale");
	createImageEffect('sepia', 0, 0,1,0.05, "Sepia");
	createImageEffect('hue', 0, 0,360,20, "Hue");
	
	//dialog 
		$('#launchImageEffets').click(function(){
			$("#imageEffects").slideToggle();
			initializeImageEffects();
		});

	//Start transparency settings
	$('#transparency_slider').attr("value", localStorage['transparency']);
	$("#transparency_value").html((localStorage['transparency']*100)+"%");
	$('#transparency_slider').change(function() {
		localStorage['transparency'] = this.value;
		$("#transparency_value").html((Math.round(localStorage['transparency']*100))+"%");
	});
	//End transparency settings

	$('#background-width-settings button').click(function() { localStorage.widthMode = $(this).attr("id");});
	$('#background-width-settings #' + localStorage.widthMode).addClass('active');
});

var currentlyEditingbackground;
function createImageEffect(setting, defaultValue, minValue, maxValue, increment, humanReadable) {
	if (!localStorage['base64'] || !JSON.parse(localStorage['base64'])[setting]) {
		var defaultValue = '0';
	} else {
		var defaultValue = JSON.parse(localStorage['base64'])[setting];
	}
	$( '#' + setting + '_effect' ).before('<span class="humanReadable">'+humanReadable+':</span>').after('<input id="'+setting+'_slider" type="range" min="'+minValue+'" max="'+maxValue+'" step="'+increment+'" /><br>');
	$('#'+setting+'_slider').mousedown(function() {
		currentlyEditingbackground = JSON.parse(localStorage['base64']);
	});
	$('#'+setting+'_slider').change(function() {
		currentlyEditingbackground[setting] = this.value;
		$("#img_preview").attr("src", "data:image/png;base64, " + currentlyEditingbackground.src).css({
			"-webkit-filter": "hue-rotate("+currentlyEditingbackground.hue+"deg) grayscale("+currentlyEditingbackground.grayscale+") sepia("+currentlyEditingbackground.sepia+")"
		});
	});
	$('#'+setting+'_slider').mouseup(function() {
		localStorage['base64'] = JSON.stringify(currentlyEditingbackground);
	});
}