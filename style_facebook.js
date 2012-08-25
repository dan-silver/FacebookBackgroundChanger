var vars=new Array();
var sharedBackground = false;

function getLocalBackground() {
	previousLookup = '';
	var currentBackground = JSON.parse(vars[2]);
$('#chromeFacebookbackground').css({
	"background": 'url(data:image/png;base64,'+currentBackground.src+')',
	"-webkit-filter": "hue-rotate("+currentBackground.hue+"deg) grayscale("+currentBackground.grayscale+") sepia("+currentBackground.sepia+")"
});
autoWidth();
}
  
var Facebook_ID = $(".firstItem a").attr("href").split(".com/")[1].split("?")[0];
chrome.extension.sendMessage({FacebookID: Facebook_ID}); //save users Facebook username

var previousLookup;
function lookup_backgrounds() {
	if (!$("#chromeFacebookbackground").length) {
		$("body").prepend('<div id="chromeFacebookbackground"></div>');
	}
	var otherUser = document.URL.split(".com/")[1].split("?")[0];
	if (!otherUser || (otherUser == Facebook_ID)) {
		getLocalBackground();
		return;
	}
	if(otherUser != previousLookup) {
		$.ajax({
			url:'http://www.dansilver.info/fbBackgroundChanger/sharedBackgrounds/backgrounds/'+otherUser+'.txt',
			error: function() {
				sharedBackground = false;
				getLocalBackground();
				previousLookup = otherUser;
			},
			success: function(data) {
				previousLookup = otherUser;
				sharedBackground = true;
				var currentBackground = JSON.parse(data);
				$('#chromeFacebookbackground').css("background","url(data:image/png;base64,"+currentBackground.src+')');
				$('#chromeFacebookbackground').css("-webkit-filter","hue-rotate("+currentBackground.hue+"deg) grayscale("+currentBackground.grayscale+") sepia("+currentBackground.sepia+")");
				autoWidth();
			}
		});
	}
}
updateBackgroundSettings();
setInterval(function() {
	updateBackgroundSettings();
}, 2000);
  
window.onresize = function() {
	autoWidth();
}
autoWidth();
function autoWidth() {
	if (vars[0] == "automatic") {
		$('#chromeFacebookbackground').css({
			"background-size": document.width
		});	
	}
}
function updateBackgroundSettings() {
	chrome.extension.sendMessage({method: "get_vars"}, function(response) {
		vars = response.variables.split('~~~');
		lookup_backgrounds();
	});
	if (!$("#background_changer_link").length)  {
		$("#pageNav").prepend('<li id="background_changer_link"  class="navItem"><a href="'+chrome.extension.getURL("options.html")+'" target="_blank">Change Background</a></li>');
	}
	$(".fbTimelineTimePeriod").css("background", "none");	
	$('#leftCol, .UIStandardFrame_Container, .fbTimelineUFI, .timelineUnitContainer, div#contentCol.homeFixedLayout, .ego_column').css("background-color", "rgba(255,255,255,"+vars[1]+")");
		$(".fbTimelineCapsule .timelineUnitContainer").css("background-color", "rgba(255,255,255,"+vars[1]+")");
}