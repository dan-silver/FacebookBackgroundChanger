function updatePreview() {
	if (localStorage['base64']) {
		$("#noBackground").hide();
		$("#removeBtn").show();
		var currentBackground = JSON.parse(localStorage['base64']);
		$("#img_preview").attr("src", "data:image/png;base64, " + currentBackground.src).css("display", "block"); 
	} else {
		$("#noBackground").show();
		$("#removeBtn").hide();
		$("#img_preview").attr("src", "").hide();
	}
}

function display_logged_in_status() {
	if (localStorage['name']) {
		$("#userName").html('Signed in as ' + localStorage['name']);
		$("#reset_ver").text("(Logout)");
		$("#logInBtn").hide();
		$("#logOutBtn").show();
		
	} else {
		$("#logInBtn").show();
		$("#logOutBtn").hide();
		$("#userName").html("");
	}
}

chrome.extension.onMessage.addListener( function(request, sender, sendResponse) {
	if(request.new_auth_info) {
		display_logged_in_status();
		lookupPurchasedBackgrounds();
	} else if (request.display_pictures) {
		updatePreview();	
	} else if (request.message) {
		message(request.message);
	}
});

$(function() {
	display_logged_in_status();
	$('#logInBtn').click(function() {
		for(i = 1; i < (numberOfBackgrounds+1); i++){
			localStorage['purchased_background-'+i] = '';
		}
		prepareStore();
		chrome.extension.sendMessage({resetAuthentication: "true"});
	});
	$('#logOutBtn').click(function() {
		localStorage['gid'] = '';
		localStorage['name'] = '';
		display_logged_in_status();
	});	
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
	
	$('#removeBtn').click(function() {
		localStorage.removeItem('base64');
		updatePreview();
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