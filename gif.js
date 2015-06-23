function onClickHandler(info, tab) {
	chrome.tabs.getSelected(null, function(tab) {
		if (info.menuItemId == "copyGifUrl"){
			chrome.tabs.sendMessage(tab.id, {command: info.menuItemId}, function(response) {
				console.log(response.url);
					var urlTextArea = document.createElement('textarea');
					urlTextArea.value = response.url;
					document.body.appendChild(urlTextArea);
					urlTextArea.select();
					document.execCommand('copy');
					document.body.removeChild(urlTextArea);
			});
		}else if (info.menuItemId == "downloadGif"){
			chrome.tabs.sendMessage(tab.id, {command: info.menuItemId});
		}
	});
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({"title": "Copy Gif Url", "contexts": ["video"],
															"id": "copyGifUrl",
															"documentUrlPatterns": ["*://9gag.com/"]});
	chrome.contextMenus.create({"title": "Download Gif", "contexts": ["video"],
															"id": "downloadGif",
															"documentUrlPatterns": ["*://9gag.com/"]});
});
