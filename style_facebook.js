var vars=new Array();

function fetch_update() {
chrome.extension.sendRequest({method: "get_vars"}, function(response) {
  vars = response.variables.split(',');
	$('body').css({
		"background": 'url(data:image/png;charset=utf-8;base64,'+vars[0]+')',
		"background-attachment": "fixed"
	});
	$('#leftCol, .UIStandardFrame_Container, .fbTimelineUFI, .timelineUnitContainer, div#contentCol.homeFixedLayout, .ego_column').css("background-color", "rgba(255,255,255,"+vars[1]+")");
	$(".fbTimelineCapsule .timelineUnitContainer").css("background-color", "rgba(255,255,255,"+vars[1]+")");
	});

	if (!$("#background_changer_link").length)  {
		$("#pageNav").prepend('<li id="background_changer_link"  class="navItem"><a href="'+chrome.extension.getURL("options.html")+'" target="_blank">Change Background</a></li>');
	}
	$(".fbTimelineTimePeriod").css("background", "none");
}
fetch_update();

setInterval(function() {
	fetch_update();
  }, 2000);