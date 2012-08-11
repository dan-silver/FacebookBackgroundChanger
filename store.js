var numberOfBackgrounds = 19;
var currentSort,i;
google.load('payments', '1.0', {
    'packages': ['production_config']
});
$(document).ready(function(){
	prepareStore(1);
	prepare_store_filters();
});
function bind_purchase_buttons() {
	$("button.purchase").click(function() {
		if (!localStorage['gid']) {
			noty({
				text: 'Please log in to your Google account before purchasing a background. Click \"Log In\" in the top right corner of this page.',
				layout: "center",
				type: 'warning',
				timeout: 3000,
			});
			return;
		}
		if ($(this).find("span").text() == "Install") { //The button changed from a purchase button to an install button, don't prompt google wallet
			return;
		}
		var temp_bid = $(this).attr("bid");
		$.ajax({
			type : 'POST',
			url : 'http://dansilver.info/wallet/jot-maker.php/',
			dataType : 'json',
				data: {
					"gid" : localStorage['gid'],
					"bid" : temp_bid
				},
			success : function(data){
				goog.payments.inapp.buy({
					parameters: {},
					jwt: data.jwt,
					success: function() {
						noty({
							text: 'Thank you for purchasing a background! You may now click on the "install" button on top of the background that you purchased to begin using it.  If you have this extension on a different computer, you can log in with the same Google account and the background will be available.',
							layout: "center",
							type: 'success',
							  buttons: [{text: 'Ok', onClick: function($noty) {$noty.close();}}]
						});	
						$('button.[bid="'+temp_bid+'"]').after('<button bid="'+temp_bid+'" class="install" style="cursor: pointer;">Install</button>').remove();
						$("button").button();
						bind_install_buttons();
						localStorage['purchased_background-'+temp_bid] = 1;
					},
					failure: function() {}
				});
			}
		});
	});
}	
	
function lookup_purchased_backgrounds() {
	if (!localStorage['gid']) {
	//	console.log('Not logged in');
		return;
	}
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/wallet/lookup_purchased_backgrounds.php',
		dataType : 'json',
			data: {
				"gid" : localStorage['gid'],
			},
		success : function(data){
			if (data) {
			//	console.log(data);
				var bids = data.split(",");
				$("#store button").each(function() {
					if (bids.indexOf($(this).attr("bid")) > -1) {
						$(this).removeClass("purchase").addClass("install").find("span").text("Install");
						localStorage['purchased_background-'+$(this).attr("bid")] = 1;
					}
				});
				bind_install_buttons();
			}
		}
	});
}

function prepareStore(sort) {
	currentSort = sort;
	$("#catalog").html("");
	var tempString='',storeContent = '';
	var dimmensions = ["1400x938", "1400x918", "1400x1050", "1400x1050", "1400x1050", "1400x947","1400x1048","1400x875","1400x1050","1280x1024","1400x875","1263x1050","1400x931","1360x1050","1305x1050","1292x1050","1400x1015","1400x778"];
	for(i = 1; i < (numberOfBackgrounds+1); i++){
	
		tempString = '<div class="outer"><div class="inner"><img id="img_'+i+'" src="premium_backgrounds/'+i+'_small.jpg"><br>';
		
		if (localStorage['purchased_background-'+i] == 1) {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="install">Install</button>';
		} else {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="purchase">$0.99</button>';
		}		
		tempString+= '<span class="info">Size: '+dimmensions[i-1]+'px</span></div></div>';
		if(typeof(sort)==='undefined') {
			$("#catalog").append(tempString);
		} else {
			$("#catalog").prepend(tempString);
		}
	}
	$("button").button();
	bind_install_buttons();
	bind_purchase_buttons();
}

function bind_install_buttons() {
	$('button.install').unbind('click');
	$("button.install").click(function() {
		$.ajax({
			type : 'POST',
			url : 'http://dansilver.info/wallet/download_premium_backgrounds.php/',
			dataType : 'json',
				data: {
					"gid" : localStorage['gid'],
					"bid" : $(this).attr("bid")
				},
			success : function(data){
				if (data) {
					localStorage['temp'] = data.premium_background_base64;
					update_history();
				} else {
				//	console.log("You haven't purchased this background...yet");
				}
			}
		});
	});
}

function prepare_store_filters() {
	$( "#store-filters" ).buttonset();
	$("#newest").click(function() {
		prepareStore(1);
	});	
	$("#oldest").click(function() {
		prepareStore();
	});
}