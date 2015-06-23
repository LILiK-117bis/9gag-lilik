function onClickHandler(info, tab) {
	chrome.tabs.getSelected(null, function(tab) {
		switch( info.menuItemId ){
			case "copyPostPermalink":
			case "copyGifUrl":
				copyToClipboard( info, tab );
				break;
			case "downloadGif": 
				chrome.tabs.sendMessage(tab.id, {command: info.menuItemId});
				break;
		}
		
	});
}

function copyToClipboard(info, tab){

	chrome.tabs.sendMessage(tab.id, {command: info.menuItemId}, function(response) {
					var urlTextArea = document.createElement('textarea');
					urlTextArea.value = response.url;
					document.body.appendChild(urlTextArea);
					urlTextArea.select();
					document.execCommand('copy');
					document.body.removeChild(urlTextArea);
			});

}
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({	"title": "Copy Gif Url", 
								"contexts":["video"], 
								"id": "copyGifUrl",
								"documentUrlPatterns": ["*://9gag.com/*"]

							},
								confirmMenuCreation );

chrome.contextMenus.create({	"title": "Download Gif", 
								"contexts":["video"], 
								"id": "downloadGif",
								"documentUrlPatterns": ["*://9gag.com/*"]
								
							},
								confirmMenuCreation );

chrome.contextMenus.create({	"title": "Copy post permalink", 
								"contexts":["link"], 
								"id": "copyPostPermalink",
								"documentUrlPatterns": ["*://9gag.com/*"]
								
							},
								confirmMenuCreation );

function confirmMenuCreation(){
	// console.log("Created context menu");
}
