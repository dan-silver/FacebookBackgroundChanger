var vars=new Array();
var sharedBackground = false;

function fetch_update() {
chrome.extension.sendMessage({method: "get_vars"}, function(response) {
  vars = response.variables.split(',');
	if (sharedBackground) return;
	$('body').css({
		"background": 'url(data:image/png;charset=utf-8;base64,'+vars[0]+')',
//		"background-size" : '100%',
		"background-repeat" : 'no-repeat',
		"background-attachment": "fixed"
	});
	updateBackgroundSize();
	$('#leftCol, .UIStandardFrame_Container, .fbTimelineUFI, .timelineUnitContainer, div#contentCol.homeFixedLayout, .ego_column').css("background-color", "rgba(255,255,255,"+vars[1]+")");
	$(".fbTimelineCapsule .timelineUnitContainer").css("background-color", "rgba(255,255,255,"+vars[1]+")");
	});

	if (!$("#background_changer_link").length)  {
		$("#pageNav").prepend('<li id="background_changer_link"  class="navItem"><a href="'+chrome.extension.getURL("options.html")+'" target="_blank">Change Background</a></li>');
	}
	$(".fbTimelineTimePeriod").css("background", "none");
}
fetch_update();

  
// *** Shared Backgrounds ***

//save users background
var Facebook_ID = $(".firstItem a").attr("href").split(".com/")[1].split("?")[0];
chrome.extension.sendMessage({FacebookID: Facebook_ID});

//lookup other users backgrounds
var previousLookup;
function lookup_backgrounds() {
	var otherUser = document.URL.split(".com/")[1];
	if (!otherUser) return;
	if (otherUser == previousLookup)  return; //Already using the correct background for this user
	if (otherUser == Facebook_ID) return; //not on your own profile
	console.log('Looking up a shared backrground');
	$.ajax({
		url:'http://www.dansilver.info/fbBackgroundChanger/sharedBackgrounds/backgrounds/'+otherUser+'.png',
		type:'HEAD',
		error: function() {
			sharedBackground = false;
		},
		success: function() {
			console.log('Using a shared background');
			sharedBackground = true;
			$('body').css({
				"background": 'url(http://www.dansilver.info/fbBackgroundChanger/sharedBackgrounds/backgrounds/'+otherUser+'.png)',
				"background-repeat" : 'no-repeat',
				"background-attachment": "fixed"
			});
			updateBackgroundSize();
		}
	});
	previousLookup = otherUser; 
}
lookup_backgrounds();

setInterval(function() {
	fetch_update();
	lookup_backgrounds();
}, 1000);
  
window.onresize = function(event) {
	updateBackgroundSize();
}

function updateBackgroundSize() {
	$('body').css("background-size", document.width);
}