function setupVideoObject(){
	return {
		target: null, 
		gifUrl: null,
		name: null
	};

}
function setLilikLogo(){
	console.log(chrome.extension.getURL("assets/logo100.png"));
	jQuery(" header#top-nav a.logo").css({
						"background-image": "url("+chrome.extension.getURL("assets/logo100.png")+")",
						"background-repeat": "no-repeat",
						"background-size": "30px 30px"

					});
}

//roll out long post in home page:
function setLongPostListener(){

	jQuery("#list-view-2").on( "click", ".badge-evt.post-read-more", function( event ) {
		event.preventDefault();
		post = jQuery(event.target);
		// var image = post.parent().find("img");
		var sidebar = jQuery("#sidebar-longPost");
		sidebar.removeClass("closed");
		sidebar.html("<img>");
		var image = jQuery("#sidebar-longPost img");

//		image.on('error', function(){
//			image.attr("src", post.attr('href').replace("/gag/", "http://img-9gag-fun.9cache.com/photo/") + "_700b_v1.jpg");
//		});
//		
//		image.attr("src", post.attr('href').replace("/gag/", "http://img-9gag-fun.9cache.com/photo/") + "_700b.jpg");
		jQuery.get(post.attr('href'), function(content) {
			image.attr("src", jQuery(content).find('.badge-item-img').attr("src"));
		})
		// post.remove();

	});

	jQuery(document).on('scroll', function(){
		var sidebar = jQuery("#sidebar-longPost");
		if( !sidebar.hasClass('closed') ){
			sidebar.addClass('closed');
		}
	});

}
function setupLongPostSidebar(){
	jQuery(".badge-page.page .main-wrap  ").after("<div id='sidebar-longPost' class='closed'></div>");
	var pageHeight = jQuery(window).height();
	jQuery("#sidebar-longPost").css({"height": pageHeight});
}
//clean wake up overlay
function cleanWakeUp(){
	jQuery("#overlay-container").remove();
}

//set a listener to videos right click
function setVideoListener(){
	jQuery("#list-view-2").on('contextmenu', "video", function(e) {
		currentVideo.target = jQuery(event.target) ;
		currentVideo.gifUrl = currentVideo.target.parent().data("image").replace("a.gif", ".gif");
		currentVideo.name = currentVideo.target.parents("article").find("h2").text().trim() + ".gif";
	});
	jQuery("#list-view-2").on('contextmenu', "a", function(e) {
		currentVideo.target = jQuery(event.target) ;
		previous = currentVideo.target.parents("article").prev();
		if (previous.length > 0){
			currentVideo.permalink = "http://9gag.com/?id=" + previous.data("entry-id");
		}else{
			currentVideo.permalink = "http://9gag.com/?id=" + currentVideo.target.parents("article").data("entry-id");
		}
		if (currentVideo.permalink == undefined){
			console.log("Warning: unable to find the permalink for this post")
		}
	});
}


//download url 
function downloadURI(uri, name){
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	link.click();
}

//night mode
function nightMode(){
	if( isNightTime() ){
		toggleNight("on");
	}

}
function enableSoftTransitions( element ){
	jQuery(element).addClass("softTransitions");
}

function toggleNight( command ){
	nightClass = "night";
	var container = jQuery('#container');

	if( command ){
		switch( command ){
			case 'on':
				container.addClass( nightClass );
			break;
			case 'off':
				container.removeClass( nightClass );
			break;
		}
	}else{

		if( container.hasClass( nightClass ) ){
			toggleNight("off");
		}else{
			toggleNight("on");
		}
	}
}
function isNightTime(){
	var nightHour = 19;
	var date = new Date();
	var hours = date.getHours();
	if( hours >= nightHour )
		return true;
	else
		return false;
}	

//init everything
jQuery(document).ready(function() {

	setLongPostListener();
	cleanWakeUp();
	currentVideo = setupVideoObject();
	setVideoListener();
	enableSoftTransitions(jQuery("#container"));
	setupLongPostSidebar();
	nightMode();
	setLilikLogo();
	console.log("9gag Mod Successfully Loaded!");

	hash = window.location.hash.substring(1);
	if (hash){
		console.log(jQuery(document));
		jQuery(document).ajaxSuccess(function() {
			console.log("An individual AJAX call has completed successfully");
		});
		count = 0;
		while (count < 150){
			count++;
//			console.log(count);
			article = jQuery("article[data-entry-id='" + window.location.hash +"']");
			if (article.length){
				jQuery("html, body").animate({ scrollTop: jQuery("article[data-entry-id='" + hash +"']").offset().top}, 1);
				break;
			}else{
				jQuery("html, body").animate({ scrollTop: jQuery("div.loading").offset().top}, 1);
			}
		}
	}

});


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.command){
			case "copyGifUrl":
				sendResponse({ url: currentVideo.gifUrl });
				break;
			case "copyPostPermalink":
				sendResponse({ url: currentVideo.permalink });
				break;
			case "downloadGif":
				downloadURI( currentVideo.gifUrl , currentVideo.name);
				break;
		}
	}
);



