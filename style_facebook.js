var userData=[];
setInterval(function() {
	updateBackgroundSettings();
}, 4000);
  
window.onresize = function() {
	autoWidth();
}
autoWidth();
function autoWidth() {
	if (userData[0] == "automatic") {
		$('#chromeFacebookbackground').css('background-size',document.width);
	}
}
function updateBackgroundSettings() {
	if ($('body').hasClass('UIPage_LoggedOut')) return;
	chrome.extension.sendMessage({method: "get_vars"}, function(response) {
		userData = response.variables.split('~~~');
		if (userData[2] != ' ') { //background set
			if (!$("#chromeFacebookbackground").length) {
				$("body").prepend('<div id="chromeFacebookbackground"></div>');
			}
			var currentBackground = JSON.parse(userData[2]);
			$('#chromeFacebookbackground').css("background", 'url(data:image/png;base64,'+currentBackground.src+')');
			autoWidth();
		} else {
			$('#chromeFacebookbackground').remove();
		}
		if (!$("#background_changer_link").length) {
			$("#pageNav .firstItem").after('<li id="background_changer_link"  class="navItem"><a href="'+chrome.extension.getURL('options.html')+'" target="_blank" class="navLink">Customize</a></li>');
		}
		$('.fbTimelineTimePeriod').css('background', 'none');	
		$('#leftCol, .UIStandardFrame_Container, .fbTimelineUFI, .timelineUnitContainer, div#contentCol.homeFixedLayout, .ego_column').css('background-color','rgba(255,255,255,'+userData[1]+')');
		$('.fbTimelineCapsule .timelineUnitContainer').css('background-color', 'rgba(255,255,255,'+userData[1]+')');
		//Header color support
		$('#jewelContainer').css('background-color', userData[3]);
		$('#blueBar').css({
			'background-color': userData[3],
			'border-bottom': '1px solid ' + userData[3]
		});	
		$('#navSearch .uiTypeahead').css('border','none');
		$('#navSearch .uiSearchInput').css('border-top','none');
		$('#pageNav .tinyman .headerTinymanPhoto').css({
			'border': 'none',
			'border-top': 'none'
		});
		$('#pageNav .navItem a.navLink, .fbJewel a.jewelButton, #pageLogo a,#navAccountLink').hover(function() {
			$(this).css('background-color', 'transparent');
		});
		$('#pageNav .navItem a').addClass('targetAfter'); //adds class so css can target the psuedo element separator
	});
}
updateBackgroundSettings();