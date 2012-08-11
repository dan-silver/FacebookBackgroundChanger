function httpGet(url) {
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", url, false );
	xmlHttp.send( null );
	return xmlHttp.responseText;
}
var params = {}, queryString = location.hash.substring(1),regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(queryString)) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
var user = httpGet('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + params.access_token);
obj = JSON.parse(user);
chrome.extension.sendMessage({GoogleID: obj.id, GoogleName: obj.name});