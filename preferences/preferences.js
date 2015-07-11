var settings = [
	{
		id: "long_post_visualization_enabler",
		name: "Long Post Visualization Mod Enabler",
		description: "Enable long post mod?",
		type: "checkbox",
		defaultValue: "true"
		
	},{
		id: "long_post_visualization",
		name: "Long Post Visualization",
		description: "Select which way you prefer to display long posts",
		type: "radio",
		options: [ "Sidebar" ],
		defaultValue: "Sidebar"

	},{
		id: "night_mode_enabler",	
		name: "Night Mode",
		description: "Enable or disable night mode",
		type: "checkbox",
		defaultValue: "true"

	},{
		id: "night_mode_starting_hour",
		name: "Night Mode Starting Hour",
		description: "in hours. Ex: 19",
		type: "range",
		options: {
			min: "0",
			max: "24"
		},
		defaultValue: "19"
 
	},{
		id: "night_mode_ending_hour",
		name: "Night Mode Ending Hour",
		description: "in hours. Ex: 7",
		type: "range",
		options: {
			min: "0",
			max: "24"
		},
		defaultValue: "7"
	},{
		id: "video_controls_enabler",
		name: "Video controls",
		description: "Show controls on gif posts to pause or seeking gif?",
		type: "checkbox",
		defaultValue: "true"
	},{
		id: "nsfw_enabler",
		name: "Show NSFW",
		description: "Show NSFW posts without login?",
		type: "checkbox",
		defaultValue: "true"
	},{
		id: "disable_wakeup_enabler",
		name: "Wakeup pop-up",
		description: "Disable wakeup pop-up?",
		type: "checkbox",
		defaultValue: "true"
	},{
		id: "toogle_zoom_enabler",
		name: "Zoom posts shortcut",
		description: "Toogle post zoom pressing 'z' key?",
		type: "checkbox",
		defaultValue: "true"
	}
];

// var settings = [
// 	{
// 		id: "1",	
// 		name: "Message 1",
// 		description: "Lorem ipsum sit dolor amet",
// 		type: "checkbox"
// 	}, {
// 		id: "2",
// 		name: "Message 2",
// 		description: "Sim secutur iusit",
// 		type: "checkbox"
// 	}, {
// 		id: "3",
// 		name: "Message 3",
// 		description: "",
// 		type: "radio",
// 		options: [ "black", "blue"]
// 	}, {
// 		id: "4",
// 		name: "Message 4",
// 		description: "",
// 		type: "range",
// 		options: {
// 			min: "0",
// 			max: "100"
// 		} 
// 	}, {
// 		id: "5",
// 		name: "Message 5",
// 		description: "",
// 		type: "dropdown",
// 		options: [ "test", "seconda voce"]
// 	},  {
// 		id: "6",
// 		name: "Message 6",
// 		description: "",
// 		type: "text"
// 	}, 
// ];


document.addEventListener('DOMContentLoaded', function(){
	displaySettings();
	addListeners();
	loadSettings();
});

function displaySettings(){
	var tableSettings = document.getElementById("settings");
	var tableBody = tableSettings.getElementsByTagName("tbody");
	var newElement = "";

	settings.forEach( function( setting ){
		var type = "";

		newElement += "<tr id='setting_"+setting.id+"' data-type='"+setting.type+"' class='setting'><td>"+setting.name+"<span class='description'>"+setting.description+"</span></td><td>";

		switch ( setting.type ){
			case "checkbox":

				newElement += "<input id='checkbox_"+setting.id+"' type='"+setting.type+"'>";

			break;            

			case "radio":
				setting.options.forEach( function( option ){
					newElement += "<input type='"+setting.type+"' name='radio_"+setting.id+"' id='radio_"+setting.id+"_"+option+"' value='"+option+"'>";
					newElement += "<label for='radio_"+setting.id+"_"+option+"' >"+option+"</label>";

				});

			break;            

			case "range":
					newElement += "<input type='"+setting.type+"' class='rangeSelector' id='range_"+setting.id+"' min='"+setting.options.min+"' max='"+setting.options.max+"' >";
					newElement += "<label for='range_"+setting.id+"' id='range_value_"+setting.id+"' ></label>";
			break;

			case "text":
					newElement += "<input type='"+setting.type+"'>";

			break;

			case "dropdown":
					newElement += "<select>";
					setting.options.forEach( function( option ){
						newElement += "<option value='"+option.replace(" ", "_")+"'>"+option+"</option>";
					});
					newElement += "</select>";
			break;
		}


		newElement = newElement + "</td></tr>";
		
	});
	
	tableBody.innerHTML = newElement;
	tableSettings.innerHTML += tableBody.innerHTML;
	
}

function addListeners(){
	var settingsElement = document.getElementsByClassName("setting");

	for (var i = settingsElement.length - 1; i >= 0; i--) {
		settingsElement[i].addEventListener('change', saveSettings);
	}

	var rangeElements = document.getElementsByClassName("rangeSelector");

	for (var i = rangeElements.length - 1; i >= 0; i--) {
		rangeElements[i].addEventListener('change', function( element ){ 
			var labelIdNumber = this.id.split(/_(.+)?/)[1];
			updateRangeValueLabel( labelIdNumber, this.value); 
		});
	};
}

//saves the data into storage
function saveSettings(){
	var setting = this.id;
	setting = setting.split(/_(.+)?/)[1];
	var type = this.getAttribute('data-type');
	switch (type){
		case "checkbox":
			var value = this.childNodes[1].childNodes[0].checked;
		break;
		case "radio":
			var value = document.querySelector('input[name = "radio_'+setting+'"]:checked').value;
		break;
		case "text":
		case "range":
		case "dropdown":
			var value = this.childNodes[1].childNodes[0].value;
		break;
	}

	var obj = {};
	obj[setting] = value;
	chrome.storage.sync.set(
		obj
	, function(){
		//callback function after saving the preferences
		document.getElementById("bar").innerHTML = "Preferences saved, refresh 9gag pages to enable new preferences.";
		
	});
	
}

//get the value stored in the storage and will be shown in the text box.
function loadSettings( ){

	chrome.storage.sync.get( null ,function(obj){

		updateSettings(obj);
	 
	}); 
}

function updateSettings( storedSettings ){
	var displayedSettings = document.getElementsByClassName('setting');
	for (var i = displayedSettings.length - 1; i >= 0; i--) {

		var settingId = displayedSettings[i].id.split(/_(.+)?/)[1];

		var settingObject = displayedSettings[i];

		var type = settingObject.getAttribute('data-type');

		var settingValue = settings[i].defaultValue;

		var usedDefault = true;
		if( storedSettings[ settingId ] ){
			settingValue = storedSettings[settingId];
			usedDefault = false;
		}
		switch( type ){
			case ( "checkbox" ):
				settingObject.childNodes[1].childNodes[0].checked = settingValue;
			break;
			case ( "radio" ):
				document.getElementById( "radio_"+ settingId +"_"+ settingValue ).checked = true;
			break;
			case "range":
				settingObject.childNodes[1].childNodes[0].value = settingValue;
				updateRangeValueLabel( settingId , settingValue );
			break;

			case "text":
			case "dropdown":
				settingObject.childNodes[1].childNodes[0].value = settingValue;
			break;
		}
		if( usedDefault ){
			saveSettings.call( displayedSettings[i] );
		}

	};
	
	
}

function updateRangeValueLabel( labelIdNumber, value ){// console.log(this.value);

	var label = document.getElementById("range_value_"+labelIdNumber);
	label.innerHTML = value;
}

