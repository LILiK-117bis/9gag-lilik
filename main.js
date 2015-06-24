function setupVideoObject(){
	return {
		target: null, 
		gifUrl: null,
		name: null,
		permalink: null
	};

}

function setLilikLogo(){
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
		var sidebar = jQuery("#sidebar-longPost");
		sidebar.removeClass("closed");
		sidebar.html("<img>");
		var image = jQuery("#sidebar-longPost img");

		jQuery.get(post.attr('href'), function(content) {
			image.attr("src", jQuery(content).find('.badge-item-img').attr("src"));
		})

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
//	jQuery('head').append('<script type="text/javascript">GAG.Configs._configs.configs.idlePopupIdleTime = 9007199254740991; clearTimeout(GAG.PageController._idlePopupTimer); </script>');
// 31556926000 = 1 year in ms.
var code = ['GAG.Configs._configs.configs.idlePopupIdleTime = 31556926000; clearTimeout(GAG.PageController._idlePopupTimer);'].join('\n');
var script = document.createElement('script');
script.textContent = code;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
}

//set a listener to videos right click
function setVideoListener(){
	jQuery(".main-wrap").on('contextmenu', "video", function(e) {
		console.log(event.target);
		currentVideo.target = jQuery(event.target);
		currentVideo.gifUrl = currentVideo.target.parent().data("image").replace("a.gif", ".gif");
		currentVideo.name = currentVideo.target.parents("article").find("h2").text().trim() + ".gif";
	});
	jQuery(".main-wrap").on('contextmenu', "a", function(e) {
		currentVideo.target = jQuery(event.target);
		var previous = currentVideo.target.parents("article").prev();
		var id = currentVideo.target.parents("article").data("entry-id");

		if (previous.length > 0){
			id = previous.data("entry-id");
		}
		currentVideo.permalink = [location.protocol, '//', location.host, location.pathname].join('') + "?id=" + id;
		
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
	var morningHour = 7;
	var date = new Date();
	var hours = date.getHours();
	if( hours >= nightHour || hours <= morningHour)
		return true;
	else
		return false;
}	

function showNSFW(){
	jQuery(".badge-nsfw-entry-cover").each(function() {
		jQuery(this).addClass("deobfuscated");
		jQuery(this).html(jQuery('<img/>', {src: "http://img-9gag-fun.9cache.com/photo/" + jQuery(this).parents("article").data("entry-id") + "_460s.jpg",}));
	});
}

//init everything
jQuery(document).ready(function() {
	updatingDom = false;
	showNSFW();
	jQuery(".main-wrap").on("DOMNodeInserted", function() {
		if (!jQuery("#jsid-upload-menu").not(".deobfuscated").is(":visible") && !updatingDom){
			updatingDom = true;
			showNSFW();
			updatingDom = false;
		}
	});
	setLongPostListener();
	cleanWakeUp();
	currentVideo = setupVideoObject();
	setVideoListener();
	enableSoftTransitions(jQuery("#container"));
	setupLongPostSidebar();
	nightMode();
	setLilikLogo();
	console.log("9gag Mod Successfully Loaded!");
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
