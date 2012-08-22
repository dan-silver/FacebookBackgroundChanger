var numberOfBackgrounds = 21;
var currentSort,i;
google.load('payments', '1.0', {
    'packages': ['production_config']
});
$(document).ready(function(){
	prepareStore();
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
	if (!localStorage['gid']) return; //	not logged in to Google
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/wallet/lookup_purchased_backgrounds.php',
		dataType : 'json',
			data: {
				"gid" : localStorage['gid'],
			},
		success : function(data){
			if (!data) return;
			var bids = data.split(",");
			$("#store button").each(function() {
				if (bids.indexOf($(this).attr("bid")) > -1) {
					$(this).removeClass("purchase").addClass("install").find("span").text("Install");
					localStorage['purchased_background-'+$(this).attr("bid")] = 1;
				}
			});
			bind_install_buttons();
		}
	});
}

var backgrounds = [];
backgrounds[1] = {
	"dimensions": "1400x938",
	"tags": "nature"
};
backgrounds[2] = {
	"dimensions": "1400x918",
	"tags": "other"
};
backgrounds[3] = {
	"dimensions": "1400x918",
	"tags": "effects"
};
backgrounds[4] = {
	"dimensions": "1400x1050",
	"tags": "effects"
};
backgrounds[5] = {
	"dimensions": "1400x1050",
	"tags": "effects"
};
backgrounds[6] = {
	"dimensions": "1400x947",
	"tags": "space"
};
backgrounds[7] = {
	"dimensions": "1400x1048",
	"tags": "nature"
};
backgrounds[8] = {
	"dimensions": "1400x875",
	"tags": "nature"
};
backgrounds[9] = {
	"dimensions": "1400x1050",
	"tags": "nature"
};
backgrounds[10] = {
	"dimensions": "1280x1024",
	"tags": "other"
};
backgrounds[11] = {
	"dimensions": "1400x875",
	"tags": "nature"
};
backgrounds[12] = {
	"dimensions": "1263x1050",
	"tags": "space"
};
backgrounds[13] = {
	"dimensions": "1400x931",
	"tags": "nature"
};
backgrounds[14] = {
	"dimensions": "1360x1050",
	"tags": "space"
};
backgrounds[15] = {
	"dimensions": "1305x1050",
	"tags": "other"
};
backgrounds[16] = {
	"dimensions": "1292x1050",
	"tags": "effects"
};
backgrounds[17] = {
	"dimensions": "1400x1015",
	"tags": "other"
};
backgrounds[18] = {
	"dimensions": "1400x778",
	"tags": "effects"
};
backgrounds[19] = {
	"dimensions": "1428x926",
	"preview": 1,
	"tags": "nature"
};
backgrounds[20] = {
	"dimensions": "1500x1125",
	"preview": 1,
	"tags": "nature"
};
backgrounds[21] = {
	"dimensions": "1500x1124",
	"preview": 1,
	"tags": "nature"
};

function prepareStore() {
	$("#catalog").html("");
	var tempString='',storeContent = '';
	
	for(i = 1; i < (numberOfBackgrounds+1); i++){
		tempString = '<div class="outer ' + backgrounds[i].tags + '"><div class="inner"><img id="img_'+i+'" src="premium_backgrounds/'+i+'_small.jpg"><br>';
		if (localStorage['purchased_background-'+i] == 1) {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="install">Install</button>';
		} else {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="purchase">$0.99</button>';
		}	
		if (backgrounds[i].preview == 1) {
			tempString += '<button bid="'+i+'" class="open-preview">Preview</button>';
		}
		tempString+= '<span class="info">Size: '+backgrounds[i].dimensions+'px</span></div></div>';
		$("#catalog").prepend(tempString);
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
					chrome.extension.sendMessage({update_history: "1"});
				}
			}
		});
	});
}

function prepare_store_filters() {
	$( "#store-filters" ).buttonset();
	$("#newest").click(function() {
		$("#catalog .outer").fadeIn();
	});	
	$(".category-filter").click(function() {
		$("#catalog .outer").hide();
		$("#catalog div." + $(this).attr("id")).fadeIn();
		console.log("#catalog ." + $(this).attr("id"));
	});
}