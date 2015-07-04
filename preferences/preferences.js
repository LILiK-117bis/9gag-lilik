//saves the data into storage
function saveSettings(){
    var setting = this.id;
    setting = setting.split("_")[1];
    var value = this.childNodes[1].childNodes[0].checked;

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
function getSetting( settingId ){
    chrome.storage.sync.get( settingId ,function(obj){

         document.getElementById( "setting_" + settingId ).childNodes[1].childNodes[0].checked = obj[settingId];
         // console.dir( obj[settingId]);
    });   
}

//calling the getSetting() function to show the saved message when opening from 2nd time.
document.addEventListener('DOMContentLoaded', function(){
    loadSettings();
    addListener();

});
//binding change event to text box to call function to save data
function addListener(){
    var settingsElement = document.getElementsByClassName("setting");

    for( var i = 0 ; i < settingsElement.length; i++){
        settingsElement[i].addEventListener('change', saveSettings);

    }

    
}

var settings = [
    {
        id: "1",
        name: "Message",
        type: "checkbox"
    }, {
        id: "2",
        name: "Message 2",
        type: "checkbox"
    }, {
        id: "3",
        name: "Message 3",
        type: "checkbox"
    }, 
];

function loadSettings(){
    var table = document.getElementById("settings");

    settings.forEach( function( setting ){
        var type = "";
        table.innerHTML = table.innerHTML + "<tr id='setting_"+setting.id+"'' class='setting'><td>"+setting.name+"</td><td><input type='"+setting.type+"'></td><tr>";
        getSetting( setting.id );
    });
    
}


