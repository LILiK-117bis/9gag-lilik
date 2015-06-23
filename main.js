function setupVideoObject(){
	return {
		target: null, 
		gifUrl: null,
		name: null
	};

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

		image.on('error', function(){
			image.attr("src", post.attr('href').replace("/gag/", "http://img-9gag-fun.9cache.com/photo/") + "_700b.jpg");
		});
		
		image.attr("src", post.attr('href').replace("/gag/", "http://img-9gag-fun.9cache.com/photo/") + "_700b_v1.jpg");
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
	console.log("9gag Mod Successfully Loaded!");

	// hash = window.location.hash.substring(1);
	// if (hash){
	// 	count = 0;
	// 	while (count < 15){
	// 		count++;
	// 		article = jQuery("article[data-entry-id='" + window.location.hash +"']");
	// 		if (article.length){
	// 			jQuery("html, body").animate({ scrollTop: jQuery("article[data-entry-id='" + hash +"']").offset().top}, 1000);
	// 			break;
	// 		}else{
	// 			jQuery("html, body").animate({ scrollTop: jQuery("div.loading").offset().top}, 1000);
	// 		}
	// 	}
	// }

});


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.command){
			case "copyGifUrl":
				sendResponse({ url: currentVideo.gifUrl });
				break;
			case "downloadGif":
				downloadURI( currentVideo.gifUrl , currentVideo.name);
				break;
		}
	}
);



