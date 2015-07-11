function setupVideoObject(){
	return {
		target: null, 
		gifUrl: null,
		name: null,
		permalink: null
	};
}


function getSettings( setting ){
	var value = chrome.storage.sync.get( setting, function(obj){
		settings =  obj;
		initExtension();
	});
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
	if( settings.long_post_visualization == "Sidebar" && settings.long_post_visualization_enabler){

		jQuery("#list-view-2").on( "click", ".badge-evt.post-read-more", function( event ) {
			event.preventDefault();
			
			post = jQuery(event.target);
			
			var sidebar = jQuery("#sidebar-content-mod");
			sidebar.removeClass("closed");
			sidebar.html("<img>");
			
			var image = jQuery("#sidebar-content-mod img");

			jQuery.get( post.attr('href'), function(content) {
				image.attr("src", jQuery(content).find('.badge-item-img').attr("src"));
			});

		});

		jQuery(document).on('scroll', function(){
			closeSidebar();
		});
		
	}
	if( settings.long_post_visualization == "Inline" && settings.long_post_visualization_enabler){

		jQuery("#list-view-2").on( "click", ".badge-evt.post-read-more", function( event ) {
			event.preventDefault();
			
			post = jQuery(event.target);

			
			var image = post.parents('article').find("img");

			jQuery.get( post.attr('href'), function(content) {
				image.attr("src", jQuery(content).find('.badge-item-img').attr("src"));
			});
			$(window).bind('scroll', post.parents('article').first(), function(event){
				console.log(event);
				console.log(event.data.offset());
				if($(window).scrollTop() > (event.data.offset().top + event.data.height())) {
					console.log('out');
					$(window).unbind('scroll');
				}
			});

		});

		jQuery(document).on('scroll', function(){
			closeSidebar();
		});
		
	}

}

function closeSidebar(){
			var sidebar = jQuery("#sidebar-content-mod");
			if( !sidebar.hasClass('closed') ){
				sidebar.addClass('closed');
			}
}

function setupSidebar(){
	if( !jQuery("#sidebar-content-mod").length ){
		
		jQuery("#container").after("<div id='sidebar-content-mod' class='closed'></div>");
		var menuHeight = jQuery("#top-nav").height();
		$('html').keydown(function(e){
			var sidebar = jQuery("#sidebar-content-mod");
			if (sidebar.is(':visible')){
				switch (e.keyCode){
					case 38:
						sidebar.scrollTop(sidebar.scrollTop()-20);
						e.preventDefault();
						break;
					case 40:
						sidebar.scrollTop(sidebar.scrollTop()+20);
						e.preventDefault();
						break;
				}
				var img = sidebar.find('img');
				console.log(img.height(), -img.offset().top + parseInt(sidebar.css('top'),10));
				if(img.height() <= -img.offset().top + parseInt(sidebar.css('top'),10)){
					closeSidebar();
				}
			}
		});

	}
	var pageHeight = jQuery(window).height();
	jQuery("#sidebar-content-mod").css({"height": pageHeight, top: menuHeight});
	
}

//clean wake up overlay
function cleanWakeUp(){
	if (settings.disable_wakeup_enabler) {
		executeScriptOnPage('GAG.Configs._configs.configs.idlePopupIdleTime = 2147483647; clearTimeout(GAG.PageController._idlePopupTimer);');
	}
}

//set a listener to videos right click
function setVideoListener(){

	jQuery(".main-wrap").on('contextmenu', "video", function(e) {
		currentVideo.target = jQuery(event.target);
		currentVideo.gifUrl = currentVideo.target.parent().data("image");
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

function setOnNewNodeListener(){
	jQuery(".main-wrap").on("DOMNodeInserted", function(e) {
		if ( !updatingDom ){
			updatingDom = true;
			var element = jQuery(e.target);
			showNSFWPost(element);
			showVideoControls(element);
			updatingDom = false;
		}
	});
}
function setOnWindowResizeListener(){
	jQuery(window).on('resize', function(){
		setupSidebar();
	});
}

//download url 
function downloadURI(uri, name){

	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	link.click();
}

function enableSoftTransitions( element ){

	jQuery(element).addClass("softTransitions");

}

//night mode
function nightMode(){
	if( hasComments())
		setInvertCommentImages();

	if( isNightTime() && settings.night_mode_enabler ){
		toggleNight("on");
	}

}

function isNightTime(){

	var nightHour = 19;
	var morningHour = 7;
	if( typeof settings.night_mode_starting_hour != "undefined" ){
		nightHour = settings.night_mode_starting_hour;
	}
	if( typeof settings.night_mode_ending_hour != "undefined"){
		morningHour = settings.night_mode_ending_hour;
	}

	// if( getSetting("night_mode_starting_hour") ){
	// 	nightHour = getSetting("night_mode_starting_hour");
	// 	console.log(nightHour);
	// }

	var date = new Date();
	var hours = date.getHours();
	if( hours >= nightHour || hours <= morningHour)
		return true;
	else
		return false;
}	
function hasComments(){
	return jQuery("#gcomment-widget-jsid-comment-sys").length;
}

function toggleNight( command ){

	nightClass = "night";
	var container = jQuery('#container');
	var sectionHeader = jQuery('section.section-header');

	if( hasComments())
		var commentPosts = frames['gcomment-widget-jsid-comment-sys'].document.getElementsByClassName("post-comment")[0];


	if( command ){
		switch( command ){
			case 'on':
				container.addClass( nightClass );
				sectionHeader.addClass( nightClass );
					if( hasComments())
						addClass( commentPosts, nightClass );
			break;
			case 'off':
				container.removeClass( nightClass );
				sectionHeader.removeClass( nightClass );
					if( hasComments())
						removeClass( commentPosts, nightClass );

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

function setInvertCommentImages(){
	// jQuery( "img", frames['gcomment-widget-jsid-comment-sys'].document ).css({"-webkit-filter" : "invert(100%)"});
	
	var cssLink = document.createElement("link") 
	cssLink.href = chrome.extension.getURL("style.css");
	cssLink.rel = "stylesheet"; 
	cssLink.type = "text/css"; 	
	frames['gcomment-widget-jsid-comment-sys'].document.body.appendChild(cssLink);

}

function showNSFWPost(e){
	if (e == undefined ){
		jQuery(".badge-nsfw-entry-cover").each(function() {
			showNSFWPost(jQuery(this));
		});
	}else{
		e.find(".badge-nsfw-entry-cover").addBack(".badge-nsfw-entry-cover").each(function() {
			var tmp = jQuery(this);
			tmp.addClass("lilik-deobfuscated");
			var imageSource = "http://img-9gag-fun.9cache.com/photo/" + tmp.parents("article").data("entry-id") + "_460s.jpg";
			// TODO: isn't enough a string instead of a jquery object?
			tmp.html( jQuery('<img/>', { src: imageSource } ));
			//TODO: show NSFW gif
//			tmp.find('img').hide();
//			var video = jQuery('<video preload="auto" poster="http://img-9gag-fun.9cache.com/photo/' + tmp.parents("article").data("entry-id") + '_460s.jpg" loop/>');
//			if (!tmp.hasClass("badge-evt")){
//				video.width("600px");
//			}else{
//				video.width("500px");
//			}
//			tmp.addClass("badge-animated-cover badge-track badge-track-no-follow");
//			divvo = jQuery('<div/>').addClass("badge-animated-container-animated");
//			divvo.append(video);
//			divvo.append('<div class="badge-animated-container-static gif-post presenting">\
//            <img class="badge-item-img" src="http://img-9gag-fun.9cache.com/photo/aw7VWyQ_460s.jpg" alt="No diving zone" style="visibility: hidden;">\
//                        <span class="play badge-gif-play badge-auto-clicked">GIF</span>\
//        </div>');
//        	tmp.append(divvo);
//			video.append('<source/>').error(function() {
//				// video not found, restore img
//				video.parents('div.badge-animated-container-animated').remove();
//				tmp.find('img').show();
//				tmp.removeClass("badge-animated-cover badge-track badge-track-no-follow");
//				if (!tmp.hasClass("badge-evt")){
//					tmp.click(function(e){e.preventDefault();});
//					tmp.addClass("badge-post-zoom zoomable").removeClass("badge-nsfw-entry-cover");
//				}
//			}).attr('src', 'http://img-9gag-fun.9cache.com/photo/' + tmp.parents("article").data("entry-id") + '_460sv.mp4', 'type', 'video/mp4');
//        	video.click(function(){
//				if (this.paused == false) {
//					this.pause();
//				} else {
//					this.play();
//				}
//			});
//			divvo.click(function(e){
//				e.stopPropagation();
//				e.preventDefault();}
//			);
		});
	}
}

function showNSFW(e){
	if ( !jQuery("#jsid-upload-menu").not(".lilik-deobfuscated").is(":visible") && settings.nsfw_enabler){
			showNSFWPost(e);
	}
}

function showVideoControls(e){
	if ( settings.video_controls_enabler ){
			showVideoControlsPost(e);
	}
}

function showVideoControlsPost(e){
	if (e == undefined ){
		jQuery("video").each(function() {
			showVideoControlsPost(jQuery(this));
		});
	}else{
		e.each(function() {
			jQuery(this).find("video").addBack("video").on('play', function(event) {
				setTimeout(function(element){jQuery(element).find("video").addBack("video").attr('controls',true);}, 2000, event.target);
			});
		});
	}
}

function toogleZoom(){
	// TODO: comment and rewrite ammodo
	if (settings.toogle_zoom_enabler) {
		$('html').keydown(function(e){
			switch (e.keyCode){
				case 74:
				case 75:
				case 90:
					if (jQuery("#jsid-modal-post-zoom").is(':visible')){
						executeScriptOnPage('jQuery("a.badge-overlay-close.close-button").click();');
					}else if (e.keyCode == 90){
						var a = jQuery('article.badge-in-view.badge-in-view-focus').first().find('a').first();
						//a.click(function(e){e.preventDefault();});
						a.addClass("badge-post-zoom zoomable");
						executeScriptOnPage('jQuery("article.badge-in-view.badge-in-view-focus").first().find("a").first().click()');
						a.removeClass("badge-post-zoom zoomable");
					}
					break;
			}
		});
	}
}

//init everything

jQuery(document).ready(function() {
	updatingDom = false;
	getSettings();
});

function initExtension(){
	showNSFW();
	showVideoControls()
	
	setOnNewNodeListener();
	setOnWindowResizeListener();
	setLongPostListener();
	toogleZoom();

	cleanWakeUp();

	// TODO: this object is not in the right place:
	currentVideo = setupVideoObject();
	setVideoListener();

	enableSoftTransitions(jQuery("#container"));

	setupSidebar();

	nightMode();
	setLilikLogo();
	
	console.log("9gag Mod Successfully Loaded!");
}
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

// javascript utils to manipulate classes:
// necessary to hack the comments css

function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ');
    }
}

function executeScriptOnPage(code){
	var s = document.createElement('script');
	s.type = "text/javascript";
	s.textContent = code;
	(document.head||document.documentElement).appendChild(s);
}
