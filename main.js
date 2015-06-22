var currentVideo = null;

jQuery("#list-view-2").on( "click", ".badge-evt.post-read-more", function( event ) {
	actual = jQuery(event.target);
	actual.parent().find("img").attr("src", actual.attr('href').replace("/gag/", "http://img-9gag-fun.9cache.com/photo/") + "_700b_v1.jpg");
	actual.remove();
	event.preventDefault();
});

jQuery(document).ready(function() {
	jQuery("#overlay-container").remove();
	hash = window.location.hash.substring(1);
	if (hash){
		count = 0;
		while (count < 15){
			count++;
			article = jQuery("article[data-entry-id='" + window.location.hash +"']");
			if (article.length){
				jQuery("html, body").animate({ scrollTop: jQuery("article[data-entry-id='" + hash +"']").offset().top}, 1000);
				break;
			}else{
				jQuery("html, body").animate({ scrollTop: jQuery("div.loading").offset().top}, 1000);
			}
		}
	}
});

jQuery("#list-view-2").on('contextmenu', "video", function(e) {
	currentVideo = jQuery(event.target);
});

function downloadURI(uri, name) 
{
	var link = document.createElement("a");
	link.download = "dsfsd";
	link.href = uri;
	link.click();
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "copyGifUrl" || request.command == "downloadGif"){
			url = currentVideo.parent().data("image").replace("a.gif", ".gif")
		}
		if (request.command == "copyGifUrl"){
			sendResponse({url: url});
		}else if (request.command == "downloadGif"){
			console.log(currentVideo.parents("article").find("h2").text().trim());
			downloadURI(url, currentVideo.parents("article").find("h2").text().trim() + ".gif");
		}
	}
);
