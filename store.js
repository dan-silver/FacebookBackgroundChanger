var numberOfBackgrounds = 27;
google.load('payments', '1.0', {
    'packages': ['production_config']
});
$(function() {
	prepareStore();
	$('#carousel').carousel({
		interval: 3000
	});
	
	$('#monthly-subscription').click(function() {
		if (!localStorage['gid']) {
			localStorage['currentPurchase'] = 'monthlyPurchase';
			chrome.extension.sendMessage({resetAuthentication: "true"});
			return;
		}
		purchaseSubscription();
	});
	
});
function purchaseSubscription() {
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/wallet/subscription_JWT.php/',
		dataType : 'json',
			data: {
				"gid" : localStorage['gid']
			},
		success : function(data){
			console.log(data.jwt);
			goog.payments.inapp.buy({
				jwt: data.jwt,
				success: function() {
					//enable all backgrounds
					for (var i=1;i<=numberOfBackgrounds;i++ ) {
						localStorage['purchased_background-'+i] = 1;
					}
					prepareStore();
					localStorage['currentPurchase'] = '';
				},
				failure: function(e) {console.log(e);}
			});
		}
	});
}

function resumePurchase() {
	if (localStorage['currentPurchase']) {
		if (localStorage['currentPurchase'] == 'monthlyPurchase') {
			purchaseSubscription();
		} else {
			purchaseBackground(localStorage['currentPurchase']);
		}
	}
}

function bind_purchase_buttons() {
	$("button.purchase, #carousel button").click(function() {
		if (!localStorage['gid']) {
			localStorage['currentPurchase'] = $(this).attr("bid");
			chrome.extension.sendMessage({resetAuthentication: "true"});
			return;
		}
		if ($(this).find("span").text() == "Install") { //The button changed from a purchase button to an install button, don't prompt google wallet
			return;
		}
		purchaseBackground($(this).attr("bid"));
	});
}
	
function purchaseBackground(bid) {
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/wallet/jot-maker.php/',
		dataType : 'json',
			data: {
				"gid" : localStorage['gid'],
				"bid" : bid
			},
		success : function(data){
			goog.payments.inapp.buy({
				parameters: {},
				jwt: data.jwt,
				success: function() {
					alert('Thank you for purchasing a background! You may now click on the "install" button on top of the background that you purchased to begin using it.  If you have this extension on a different computer, you can log in with the same Google account and the background will be available.');	
					localStorage['purchased_background-'+bid] = 1;
					localStorage['currentPurchase'] = '';
					lookupPurchasedBackgrounds();
				},
				failure: function(e) {console.log(e);}
			});
		}
	});
}

function lookupPurchasedBackgrounds() {
	if (!localStorage['gid']) return; //	not logged in to Google
	//check subscription
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/wallet/check-subscription.php',
		dataType : 'json',
			data: {
				"gid" : localStorage['gid'],
			},
		success : function(response){
			if (response == 1) {
				for (var i=1;i<=numberOfBackgrounds;i++ ) {
					localStorage['purchased_background-'+i] = 1;
				}
				prepareStore();
			} else {
				//check for individual backgrounds
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
						bids.forEach(function(bid) {
							localStorage['purchased_background-'+bid] = 1;
						});
						prepareStore();
					}
				});
			}
		}
	});	
}

var backgrounds = [];
backgrounds[1] = {
	"dimensions": "1400x938"
};
backgrounds[2] = {
	"dimensions": "1400x918"
};
backgrounds[3] = {
	"dimensions": "1400x918"
};
backgrounds[4] = {
	"dimensions": "1400x1050"
};
backgrounds[5] = {
	"dimensions": "1400x1050"
};
backgrounds[6] = {
	"dimensions": "1400x947"
};
backgrounds[7] = {
	"dimensions": "1400x1048"
};
backgrounds[8] = {
	"dimensions": "1400x875"
};
backgrounds[9] = {
	"dimensions": "1400x1050"
};
backgrounds[10] = {
	"dimensions": "1280x1024"
};
backgrounds[11] = {
	"dimensions": "1400x875"
};
backgrounds[12] = {
	"dimensions": "1263x1050"
};
backgrounds[13] = {
	"dimensions": "1400x931"
};
backgrounds[14] = {
	"dimensions": "1360x1050"
};
backgrounds[15] = {
	"dimensions": "1305x1050"
};
backgrounds[16] = {
	"dimensions": "1292x1050"
};
backgrounds[17] = {
	"dimensions": "1400x1015"
};
backgrounds[18] = {
	"dimensions": "1400x778"
};
backgrounds[19] = {
	"dimensions": "1428x926",
	"preview": 1
};
backgrounds[20] = {
	"dimensions": "1500x1125",
	"preview": 1
};
backgrounds[21] = {
	"dimensions": "1300x974",
	"preview": 1
};
backgrounds[22] = {
	"dimensions": "3000x1967",
	"preview": 1
};
backgrounds[23] = {
	"dimensions": "1600x1087",
	"preview": 1
};
backgrounds[24] = {
	"dimensions": "1024x768"
};
backgrounds[25] = {
	"dimensions": "1900x1200"
};
backgrounds[26] = {
	"dimensions": "1920x1200"
};
backgrounds[27] = {
	"dimensions": "1600x1066"
};

function prepareStore() {
	$("#catalog").html("");
	var tempString='',storeContent = '';
	
	for(var i = 1; i < (numberOfBackgrounds+1); i++){
		tempString = '<div class="outer"><div class="inner"><img id="img_'+i+'" src="premium_backgrounds/'+i+'_small.jpg"><br>';
		if (localStorage['purchased_background-'+i] == 1) {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="install btn btn-success">Install</button>';
		} else {
			tempString += '<button id="button-'+i+'" bid="'+i+'" class="purchase btn btn-info">Purchase</button>';
		}	
		if (backgrounds[i].preview == 1) {
			tempString += '<button bid="'+i+'" class="open-preview btn">Preview</button>';
		}
		tempString+= '<span class="info">'+backgrounds[i].dimensions+'px</span></div></div>';
		$("#catalog").prepend(tempString);
	}
	bind_install_buttons();
	bind_purchase_buttons();
	bindPreviewButtons();
}
function bindPreviewButtons() {
	$(".open-preview").click(function() {
		$("#store-preview img").attr("src", "/premium_backgrounds/previews/"+$(this).attr("bid") + ".png");
		$("#store-preview").modal({show: true});
	});
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
					chrome.extension.sendMessage({update_history: data.premium_background_base64,backgroundSrc:1});
				}
			}
		});
	});
}