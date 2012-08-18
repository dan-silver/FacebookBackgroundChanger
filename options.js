function validateURL(textval) {
  var urlregex = new RegExp(     "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}
function reset_add_picture() {
	$("#enteredURL").val("");
	$("#preview").attr("src", "");
}
function display_history() {
	var history = false;
	for(i = 1; i < 4; i++){
		if (localStorage['old' + i]) {
			$("#old" + i + " img").attr("src", "data:image/png;base64, " + localStorage['old' + i]);
			$("#old" + i).fadeIn();
			history = true;
		} else {
			$("#old" + i).fadeOut();
		}
	}
	if (history == true) {
		$("#history-label").show();
	} else {
		$("#history-label").slideUp();
	}
}
function display_current_picture() {
	if (localStorage['base64']) {
		$(".img_preview_req").show();
		$("#img_preview img").attr("src", "data:image/png;base64, " + localStorage['base64']).show();
	} else {
		$(".img_preview_req").hide();
		$("#img_preview img").attr("src", "").hide();
	}
}
function display_pictures() {
	display_history();
	display_current_picture();
}
function remove_history(item) {
	$("#" + item).hide();
	localStorage[item] = "";
	shift_history_down();
}

function shift_history_down() {
	while(!localStorage['old1'] && (localStorage['old2'] || localStorage['old3'])) {
		for(i = 1; i < 3; i++) {
			if (!localStorage['old'+i] && localStorage['old'+(i+1)]) {
				localStorage['old'+i] = localStorage['old'+(i+1)];
				localStorage['old'+(i+1)] = '';
				console.log("shifting down");
			}
		}
	}
}

function shift_history_up() {
	for(i = 2; i > 0; i--) {
		if (localStorage['old'+i]) {
			localStorage['old'+(i+1)] = localStorage['old'+i]; //old3 is old 2, old2 is old1
			localStorage['old'+i] = '';
			console.log("shifting up");
		}
	}
}

function restore_history(item) {
	localStorage['temp'] = localStorage[item]; 
	localStorage[item] = '';
	update_history();
	shift_history_down();
}

function update_history() {
	try {
		shift_history_up();
		if (localStorage['base64']) {
			localStorage['old1'] = localStorage['base64'];
			localStorage['base64'] = "";
		}
		localStorage['base64'] = localStorage['temp'];
		localStorage['temp'] = '';
		display_pictures();
		message('saved');
	} catch (e) {
		message('too_big');
	}
	shift_history_down();
	server_save_background();
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

	$(".restore").click(function() {
		restore_history($(this).parent().attr("id"));
		display_pictures();
	});
	$(".remove").click(function() {
		remove_history($(this).parent().attr("id"));
		display_pictures();
	});
	
	/** Start Premium Background Previews**/
	$("#store-preview").dialog({ autoOpen: false, width: "1000",height: "700",buttons: {
		Close: function() {
			$( this ).dialog( "close" );
		}
	}});
	$(".open-preview").click(function() {
		$("#store-preview img").attr("src", "/premium_backgrounds/previews/"+$(this).attr("bid") + ".png");
		$("#store-preview").dialog("open");
	});
	/** End Premium Background Previews**/
		
	$( "#add_picture" ).dialog({ autoOpen: false, width: "535",height: "400",buttons: {
		Cancel: function() {
			reset_add_picture();
			$( this ).dialog( "close" );
		}, Save: function() {
			update_history();
			reset_add_picture();
			$( this ).dialog( "close" );
			}
		}});
	$("button, #header_buttons a").button();
	$("#add_picture_link").click(function() {$("#add_picture").dialog("open");});
	$("#getImage").click(function() {
		if (validateURL($("#enteredURL").val()) == true) {
		$("#validURL").hide();
		$('#waiting').show(500);
		$.ajax({
			type : 'POST',
			url : 'http://www.dansilver.info/fbBackgroundChanger/convert_to_base64.php',
			dataType : 'json',
			data: {
				url : $("#enteredURL").val()
			},
			success : function(data){
				localStorage['temp'] = data.base64;
				$('#waiting').hide(500);
				$("#preview").attr("src", "data:image/png;base64, " + localStorage['temp']);
				}
			});
		} else {
			$("#validURL").show();
		}
	});


	$("#transparency_value").html(((Math.round(localStorage['transparency']*100)))+"%");
	$("#transparency_settings").slider({
		value:localStorage['transparency'],
		min: 0,
		max: 1,
		step: 0.05,
		slide: function( event, ui ) {
			 localStorage['transparency'] = ui.value;
			 $("#transparency_value").html((Math.round(ui.value*100))+"%");
		}
	});

	document.getElementById("img_preview").addEventListener("dragover", function (evt) {
		$("#current-background").css({
			"border": "4px dotted black",
			"-webkit-filter": "grayscale(1)"
		});
		evt.preventDefault();
	}, false);
	document.getElementById("img_preview").addEventListener("dragleave", function (evt) {
		resetPicture();
		evt.preventDefault();
	}, false);

function resetPicture() {
	$("#current-background").css({
		"border": "4px dotted white",
		"-webkit-filter": "grayscale(0)"
	});
}
	
	document.getElementById("img_preview").addEventListener("drop", function (evt) {
	resetPicture();
	var files = evt.dataTransfer.files;
	if (files.length < 0) {
		message("incorrectImgFormat");
		return;
	}
	var file = files[0];
	if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
		var reader = new FileReader();
		reader.onload = function (evt) {
			try {
				var temp = evt.target.result.split(',');
				localStorage['temp']  = temp[1];
				update_history();
			} catch(e) {
				message('too_big');
			}
		};
		reader.readAsDataURL(file);
	} else {
		message("incorrectImgFormat");
	}
	evt.preventDefault();
}, false);

$("#previous div").hover(function() {
	$(this).find("button").show();
}, function () {
	$(this).find("button").hide();
});
$("#remove_main").click(function() {
	localStorage['temp'] = '';
	update_history();
return false;
});
//initialize 
display_pictures();
$("html").disableSelection();
$('img').bind('dragstart', function(event) { event.preventDefault(); }); //prevent images from being dragged
//end initialize
});

/*** Help Icons***/
$(function() {
	$("img.help").click(function() {
		$("#"+$(this).attr("for")).slideToggle(300);
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
		case 'incorrectImgFormat':
				noty({
					text: 'Images need to be dragged from your computer and should end in .png, .jpg, .bmp or .gif.',
					layout: "center",
					type: 'warning',
					timeout: 5000,
				});
		break;
	}
}