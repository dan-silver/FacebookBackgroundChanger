$(function() {
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