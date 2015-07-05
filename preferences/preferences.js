var settings = [
	{
		id: "1",
		name: "Long Post Visualization",
		description: "Select which way you prefer to display long posts",
		type: "radio",
		options: [ "Sidebar", "In place"]
	},{
		id: "2",	
		name: "Night Mode",
		description: "Enable or disable night mode",
		type: "checkbox"
	},{
		id: "3",
		name: "Night Mode Starting Hour",
		description: "in hours. Ex: 19",
		type: "text"
	},{
		id: "4",
		name: "Night Mode Ending Hour",
		description: "in hours. Ex: 7",
		type: "text"
	}, 
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
			var labelIdNumber = this.id.split("_")[1];
			updateRangeValueLabel( labelIdNumber, this.value); 
		});
	};
}

//saves the data into storage
function saveSettings(){
	var setting = this.id;
	setting = setting.split("_")[1];
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
		document.getElementById("bar").innerHTML = "Saved the preferences.";
		
	});
	
}

//get the value stored in the storage and will be shown in the text box.
function loadSettings( ){

	chrome.storage.sync.get( null ,function(obj){

		updateSettings(obj);
	 
	}); 
}

function updateSettings( storedSettings ){
	for( var settingId in storedSettings ){
		settingId = String( settingId );
		settingObject = document.getElementById( "setting_"+settingId );
		type = settingObject.getAttribute('data-type');

		switch( type ){
			case ( "checkbox" ):
				settingObject.childNodes[1].childNodes[0].checked = storedSettings[settingId];
			break;
			case ( "radio" ):
				document.getElementById( "radio_"+ settingId +"_"+ storedSettings[settingId] ).checked = true;
			break;
			case "range":
				settingObject.childNodes[1].childNodes[0].value = storedSettings[settingId];
				updateRangeValueLabel( settingId , storedSettings[settingId] );
			break;

			case "text":
			case "dropdown":
				settingObject.childNodes[1].childNodes[0].value = storedSettings[settingId];
			break;
		}
	}
	
}

function updateRangeValueLabel( labelIdNumber, value ){// console.log(this.value);

	var label = document.getElementById("range_value_"+labelIdNumber);
	label.innerHTML = value;
}

