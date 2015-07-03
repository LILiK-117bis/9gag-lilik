//saves the data into storage
function saveSettings(){
    var message = document.getElementById("msg").checked;
    chrome.storage.sync.set({
        message:message
    }, function(){
        //callback function after saving the preferences
        document.getElementById("bar").innerHTML = "Saved the preferences.";
        
    })
    
}

//get the value stored in the storage and will be shown in the text box.
function getMessage(){
    chrome.storage.sync.get("message",function(obj){
         document.getElementById("msg").checked = obj.message;
    });   
}

//calling the getMessage() function to show the saved message when opening from 2nd time.
document.addEventListener('DOMContentLoaded', function(){
    getMessage();
    loadSettings();
});
//binding change event to text box to call function to save data
document.getElementById('msg').addEventListener('change', saveSettings);

var settings = [
    {
        id: 1,
        name: "Message",
        type: "checkbox"
    }
];

function loadSettings(){
    var table = document.getElementById("settings");
    settings.forEach( function( setting ){
        var type = "";
        table.innerHTML = table.innerHTML + "<tr id='setting_"+setting.id+"''><td>"+setting.name+"</td><td><input type='"+setting.type+"'></td><tr>";
    });
    
}


