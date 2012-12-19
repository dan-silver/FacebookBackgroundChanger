function initializeImageEffects() {
	var effects = ["hue", "grayscale", "sepia"];
	var currentBackground = JSON.parse(localStorage['base64']);
	for (i=0; i<effects.length; i++) {
		currentBackground[effects[i]] = 0;
		$("#"+effects[i]+'_effect').slider({value: currentBackground[effects[i]]});
	}
	localStorage['base64'] = JSON.stringify(currentBackground);
}

function updatePreview() {
	if (localStorage['base64']) {
		initializeImageEffects();
		$("#noBackground").hide();
		var currentBackground = JSON.parse(localStorage['base64']);
		$("#img_preview").attr("src", "data:image/png;base64, " + currentBackground.src).css({
			"opacity": "1",
			"height" : "auto",
			"min-height": "0px",
			"-webkit-filter": "hue-rotate("+currentBackground.hue+"deg) grayscale("+currentBackground.grayscale+") sepia("+currentBackground.sepia+")"
		}); 
	} else {
		$("#noBackground").fadeIn();
		$("#img_preview").attr("src", "").css({
			"opacity": "0",
			"height" : "0px",
			"min-height": "300px"
		});
	}
}

function display_logged_in_status() {
	if (localStorage['name']) {
		$("#ver_status_info").html('<i>' + localStorage['name'] + '</i>');
		$("#reset_ver").text("(Logout)");
	} else {
		$("#reset_ver").text("Log In with your Google Account");
		$("#ver_status_info").html("");
	}
}

chrome.extension.onMessage.addListener( function(request, sender, sendResponse) {
	if(request.new_auth_info) {
		display_logged_in_status();
		lookup_purchased_backgrounds();
		bind_purchase_buttons();
	} else if (request.display_pictures) {
		updatePreview();	
	} else if (request.message) {
		message(request.message);
	}
});

$(document).ready(function(){
	display_logged_in_status();
	$('#reset_ver').click(function() {
		for(i = 1; i < (numberOfBackgrounds+1); i++){
			localStorage['purchased_background-'+i] = '';
		}
		prepareStore();
		localStorage['gid'] = '';
		localStorage['name'] = '';
		if ($(this).text() == "(Logout)") {
			$("#reset_ver").text("Log In with your Google Account");
			$("#ver_status_info").html("");
		} else {
			chrome.extension.sendMessage({resetAuthentication: "true"});
		}
	});	
		/** Start Premium Background Previews**/
		$("#store-preview").dialog({ autoOpen: false, width: "900",height: "640",buttons: {
			Close: function() {
				$( this ).dialog( "close" );
			}
		}});
		$(".open-preview").click(function() {
			$("#store-preview img").attr("src", "/premium_backgrounds/previews/"+$(this).attr("bid") + ".png");
			$("#store-preview").dialog("open");
		});
		/** End Premium Background Previews**/
		$("button, #header_buttons a").button();
		
		$("#uploadBtn").click(function() {
			$('#theFile').click();		
		});
		$('#theFile').change(function(evt) {
			var file = evt.target.files[0];
			if (!file.type.match('image.*')) {
				return;
			}
			var reader = new FileReader();
			reader.onload = function (evt) {
				chrome.extension.sendMessage({update_history: evt.target.result.split(',')[1],backgroundSrc:1});
				updatePreview();
			};
			reader.readAsDataURL(file);
		});
	//initialize 
	updatePreview();
	$("html").disableSelection();
	//end initialize

	//color picker support
	$('#headerColor').spectrum({
		color: localStorage['headerColor'],
		showInitial: true,
		change: function(color) {
			localStorage['headerColor'] = color.toHexString(); // #ff0000
		}
	});
});

function message(status) {
	switch (status) {
		case 'saved':
			noty({
				text: 'Check Facebook! Your background has been saved.',
				layout: "center",
				type: 'success',
				timeout: 3000
			});	
		break;
		case 'too_big':
			noty({
				text: 'This image is too big, try using a smaller image and keeping the dimensions under 1600x1400px.<br>If this problem continues, try removing previous backgrounds in the history.',
				layout: "center",
				type: 'warning',
				timeout: 5000,
			});
		break;
	}
}