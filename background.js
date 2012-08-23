var currentTab;
function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('facebook.com') > -1) {
		chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function(tab) {
	open_options_page();
});

function open_options_page() {
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && tab.url=='chrome-extension://gcdkepamffmkegijpbpjnkbflkmehaga/options.html') {
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
	chrome.tabs.create({url: 'options.html'});
	});
}

function shift_history_down() {
	while((!localStorage['old1'] && (localStorage['old2'] || localStorage['old3'])) || (!localStorage['old2'] && localStorage['old3']) ) {
		for(i = 1; i < 3; i++) {
			if (!localStorage['old'+i] && localStorage['old'+(i+1)]) {
				localStorage['old'+i] = localStorage['old'+(i+1)];
				delete localStorage['old'+(i+1)];
			}
		}
	}
}

function shift_history_up() {
	for(i = 2; i > 0; i--) {
		if (localStorage['old'+i]) {
			localStorage['old'+(i+1)] = localStorage['old'+i]; //old3 is old 2, old2 is old1
			delete localStorage['old'+i];
		}
	}
}

function update_history(backgroundObject, isBackgroundSrc, clearMain) {
	try {
		shift_history_up();
		if (localStorage['base64']) {
			localStorage['old1'] = localStorage['base64'];
			delete localStorage['base64'];
		}
		if (clearMain != 1) { //just move current background to old1
			if (isBackgroundSrc) {
				localStorage['base64'] = JSON.stringify({
					src: isBackgroundSrc
				});
			} else if (backgroundObject){
				localStorage['base64'] = backgroundObject;
			}
		}
		chrome.extension.sendMessage({display_pictures: "1",message: "saved"});
	} catch (e) {
		chrome.extension.sendMessage({message: "too_big"});
	}
	shift_history_down();
	server_save_background();
}

function server_save_background() {
	if (localStorage['sharingMode'] == 'private') return;
	$.ajax({
		type : 'POST',
		url : 'http://dansilver.info/fbBackgroundChanger/sharedBackgrounds/saveBackground.php',
		dataType : 'json',
			data: {
				"FacebookID" : localStorage['FacebookID'],
				"background" : localStorage['base64']
			}
	});
}

var imageClick;
chrome.contextMenus.create({
	"title": "Set as Facebook background",
	"contexts": ["image"],
	"onclick": function (info) {
		$.ajax({
			type : 'POST',
			url : 'http://www.dansilver.info/fbBackgroundChanger/convert_to_base64.php',
			dataType : 'json',
			data: {
				url : info.srcUrl
			},
			success : function(data){
				update_history(null, data.base64);
			}
		});
	}
});

chrome.tabs.onUpdated.addListener(function(tabId) {
	chrome.tabs.get(tabId, function(tab) {
		if (tab.url.search("dansilver.info/oauth2callback/") > 0) {
			chrome.tabs.executeScript(tab.id, {file: "grab_GoogleID.js"});
		}
	});
});

chrome.extension.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.method == "get_vars") {
		vars_string = localStorage['base64'] +','+localStorage['transparency'] + ',' + localStorage['widthMode'];
		sendResponse({variables: vars_string});
    }
	if (request.FacebookID) {
		localStorage['FacebookID'] = request.FacebookID;
	} else if (request.shift_history_down) {
		shift_history_down();
	} else if (request.shift_history_up) {
		shift_history_up();
	} else if (request.update_history) {
		if (request.backgroundSrc) {
			update_history(null, request.update_history);
		} else {
			update_history(request.update_history, null);
		}
	} else if (request.clearMain) {
		update_history(null,null,1);
	}

	if(request.GoogleID) {
		localStorage['gid']=request.GoogleID;
		localStorage['name']=request.GoogleName;
		chrome.extension.sendMessage({new_auth_info: 'true'});
		chrome.tabs.update(currentTab, {active: true});
		chrome.tabs.remove(sender.tab.id);
	} else if (request.resetAuthentication) {
		chrome.tabs.getSelected(null, function(tab){ 
			currentTab = tab.id;
			chrome.tabs.create({"url": "https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://dansilver.info/oauth2callback&client_id=293292404055.apps.googleusercontent.com&hl=en&from_login=1&as=2e8b1573426b83ce&pli=1&authuser=0"});
		});
	}
});