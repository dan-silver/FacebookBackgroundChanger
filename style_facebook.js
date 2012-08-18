var vars=new Array();
var sharedBackground = false;

function getLocalBackground() {
	previousLookup = '';
	chrome.extension.sendMessage({method: "get_vars"}, function(response) {
	  vars = response.variables.split(',');
		$('body').css({
			"background": 'url(data:image/png;charset=utf-8;base64,'+vars[0]+')',
			"background-attachment": "fixed"
		});
		updateBackgroundSettings();
		$('#leftCol, .UIStandardFrame_Container, .fbTimelineUFI, .timelineUnitContainer, div#contentCol.homeFixedLayout, .ego_column').css("background-color", "rgba(255,255,255,"+vars[1]+")");
		$(".fbTimelineCapsule .timelineUnitContainer").css("background-color", "rgba(255,255,255,"+vars[1]+")");
	});

	if (!$("#background_changer_link").length)  {
		$("#pageNav").prepend('<li id="background_changer_link"  class="navItem"><a href="'+chrome.extension.getURL("options.html")+'" target="_blank">Change Background</a></li>');
	}
	$(".fbTimelineTimePeriod").css("background", "none");
}
  
// *** Shared Background Support ***

//save users Facebook username
var Facebook_ID = $(".firstItem a").attr("href").split(".com/")[1].split("?")[0];
chrome.extension.sendMessage({FacebookID: Facebook_ID});

var previousLookup;
function lookup_backgrounds() {
	var otherUser = document.URL.split(".com/")[1];
	if (!otherUser || (otherUser == Facebook_ID)) {
		getLocalBackground();
		return;
	}
	if(otherUser == previousLookup) return;
	$.ajax({
		url:'http://www.dansilver.info/fbBackgroundChanger/sharedBackgrounds/backgrounds/'+otherUser+'.png',
		type:'HEAD',
		error: function() {
			sharedBackground = false;
			getLocalBackground();
		},
		success: function() {
			sharedBackground = true;
			$('body').css({
				"background": 'url(http://www.dansilver.info/fbBackgroundChanger/sharedBackgrounds/backgrounds/'+otherUser+'.png)',
				"background-attachment": "fixed"
			});
			updateBackgroundSettings();
		}
	});
	previousLookup = otherUser; 
}

lookup_backgrounds();
setInterval(function() {
	lookup_backgrounds();
}, 1000);
  
window.onresize = function(event) {
	updateBackgroundSettings();
}

function updateBackgroundSettings() {
	if (vars[2] == "automatic") {
		$('body').css("background-size", document.width);	
	} else {
		$('body').css("background-repeat", "none");
	}
}