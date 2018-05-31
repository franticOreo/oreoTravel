// Initialise Dynamic content ==============================================

document.body.style.cursor='wait';
getTrips();
getMatches();
document.body.style.cursor='default';



// Onload =============================================================

window.onload = function() {
    document.getElementById("newTaskDate").value = new Date().toDateInputValue();

    document.getElementById("newTaskDesc").innerHTML = "";

    this.document.getElementById("addTaskCover").addEventListener("click", toggleNewTask);

    this.document.getElementById("aboutBtnDash").addEventListener("click", toggleAboutDisplay);
    this.document.getElementById("aboutBlanket").addEventListener("click", function(e){
        if (!document.getElementById("aboutPage").contains(e.target)) toggleAboutDisplay();
    });

    this.document.getElementById("btnSettings").addEventListener("click", toggleSettingsDisplay);
    this.document.getElementById("settingsBlanket").addEventListener("click", function(e){
        if (!document.getElementById("settingsPage").contains(e.target)) toggleSettingsDisplay();
    });

    this.document.getElementById("btnNewTrip").addEventListener("click", toggleNewTripDisplay);
    this.document.getElementById("newTripBlanket").addEventListener("click", function(e){
        if (!document.getElementById("newTripPage").contains(e.target)) toggleNewTripDisplay();
    });

    this.document.getElementById("btnMatch").addEventListener("click", toggleMatchDisplay);
    this.document.getElementById("matchBlanket").addEventListener("click", function(e){
        if (!document.getElementById("matchPage").contains(e.target)) toggleMatchDisplay();
    });
}



// Global variables ===================================================

var tasks = [];
var firstNames = [];
var currentTripId;
var tripIndex;
var trips = [];
var userNames = [];



// Constructors =======================================================

function tripObject(name, description, priority, date, assign){
    this._id = 0;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.date = date;
    this.assign = assign;
    this.done = false;
    return this;
}



// AJAX Requesters ====================================================

function getTasks(id) { // To be deprecated
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("GET", "/dash/task/" + id, true);
    xhttp.send();
}

function getTrips() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTripsResponse;
    xhttp.open("GET", "/dash/trips", true);
    xhttp.send();
}

function joinTrip(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleJoinTripResponse;
    xhttp.open("POST", "/dash/joinTrip/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function addTask() {
    var t = new tripObject(
        document.getElementById("newTaskName").value,
        document.getElementById("newTaskDesc").innerHTML,
        document.getElementById("newTaskPriority").value,
        new Date(document.getElementById("newTaskDate").value),
        [userNames[tripIndex][document.getElementById("newTaskAssign").selectedIndex]._id]
    );

    console.log(userNames[tripIndex][document.getElementById("newTaskAssign").selectedIndex]._id);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("POST", "/dash/task/" + currentTripId, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(t));
}

function deleteTask(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("DELETE", "/dash/task/" + currentTripId + "/" + id, true);
    xhttp.send({ tripId: currentTripId });
}

function doneTask(id) {
    var task = tasks.find(t => { return t._id == id; });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("PUT", "/dash/task/" + currentTripId + "/" + id + (task.done ? "/undo" : "/done"), true);
    xhttp.send();
}

function getMatches() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleMatchResponse;
    xhttp.open("GET", "/dash/search", true);
    xhttp.send();
}



// Http Request Response Handlers =====================================

function handleTripsResponse() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        trips = result.trips;
        userNames = result.names;

        document.getElementById("sideInfo").removeAllChildren();

        for (var i = 0; i < trips.length; i++) {
            createSideTrip(i);
        }

        if (trips[0]){
            setCurrentTrip(trips[0]._id);
        }
    }
}

function handleJoinTripResponse() {
    getTrips();
    getMatches();
}

function handleTaskResponse() {
    if (this.readyState == 4 && this.status == 200) {
        toggleNewTask();
        var t = JSON.parse(this.responseText);
        for (var i = 0; i < trips.length; i++) {
            if (trips[i]._id == currentTripId) {
                trips[i].tasks = t;
                break;
            }
        }
        setCurrentTrip(currentTripId); // Refresh All
    }
}

function handleMatchResponse() {
    if (this.readyState == 4 && this.status == 200) {
        var matches = JSON.parse(this.responseText);
        for (var i = 0; i < matches.length; i++) {
            createTripElement(matches[i]);
        }
    }
}



// Button click handlers ==============================================

function doneTaskBtnClick(){
    taskDiv = this.parentNode.parentNode;
    doneTask(taskDiv.id);
}

function deleteTaskBtnClick(){
    taskDiv = this.parentNode.parentNode;
    deleteTask(taskDiv.id);
}

function joinTripBtnClick() {
    toggleMatchDisplay();
    joinTrip(this.parentNode.parentNode.id);
}

function sideTripClick() {
    var id = this.id.split("_");
    setCurrentTrip(id[id.length-1]);
}



// Dynamic content ====================================================

function createSideTrip(tripNumber) {
    trip = trips[tripNumber];

    // Trip div
    var tripDiv = document.createElement("div");
    tripDiv.classList.add("sideTrip");
    tripDiv.classList.add("paper");
    tripDiv.id = "side_" + trip._id;
    tripDiv.addEventListener("click", sideTripClick);

    var mainDiv = document.getElementById("sideInfo");
    mainDiv.appendChild(tripDiv);

    // Title
    var title = document.createElement("h4");
    title.innerHTML = trip.title;
    title.classList.add("sideTitle");
    tripDiv.appendChild(title);

    // Expand div
    var expandDiv = document.createElement("div");
    // expandDiv.classList.add("sideTrip");
    expandDiv.id = "side_expand_" + trip._id;
    tripDiv.appendChild(expandDiv);

    // Users
    var user;
    var people = userNames[tripNumber];

    for (var i = 0; i < people.length; i++) {
        user = document.createElement("li");
        user.innerHTML = people[i].firstName + " " + people[i].lastName;
        user.classList.add("sideUser");
        expandDiv.appendChild(user);
    }
}

function createTaskElement(task){
    var taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "paper");
    taskDiv.id = task._id;
    var mainDiv = document.getElementById("main");
    
    mainDiv.appendChild(taskDiv);

    // Main content div
    var content = document.createElement("div");
    content.classList.add("taskContent");
    taskDiv.appendChild(content)

    // Task Name
    var name = document.createElement("label");
    name.innerHTML = task.name;
    name.htmlFor = taskDiv.id;
    name.classList.add("taskName");
    content.appendChild(name);

    content.appendChild(document.createElement("br"));

    // Task Details
    var description = document.createElement("label");
    description.innerHTML = task.description;
    description.classList.add("taskDetails");
    content.appendChild(description);

    // Task Footer
    var bottomDiv = document.createElement("div");
    bottomDiv.classList.add("bottomBar");
    taskDiv.appendChild(bottomDiv);

    // Priority Label
    var priority = document.createElement("label");
    priority.classList.add("priority");
    var assign = [];
    for (var i = 0; i < task.assign.length; i++) {
        for (var j = 0; j < userNames[tripIndex].length; j++) {
            if (userNames[tripIndex][j]._id == task.assign[i]){
                assign.push(userNames[tripIndex][j].firstName);
            }
        }
    }
    priority.innerHTML = dateToAussieString(task.date) + " - " + assign.join(", ") + " - " + ["High", "Medium", "Optional"][task.priority];
    bottomDiv.appendChild(priority);

    // Done Button
    var doneBtn = document.createElement("input");
    doneBtn.type = "button";
    doneBtn.classList.add("btnEmbed");
    doneBtn.value = task.done ? "Undo" : "Done";
    doneBtn.addEventListener("click", doneTaskBtnClick);
    bottomDiv.appendChild(doneBtn);

    // Delete Button
    var delBtn = document.createElement("input");
    delBtn.type = "button";
    delBtn.classList.add("btnEmbed");
    delBtn.value = "Delete";
    delBtn.onclick = deleteTaskBtnClick;
    bottomDiv.appendChild(delBtn);

    setTaskColor(task);
}

function createTripElement(trip) {
    var tripDiv = document.createElement("div");
    tripDiv.classList.add("task", "paper");
    tripDiv.id = trip._id;
    var mainDiv = document.getElementById("matchContent");
    
    mainDiv.appendChild(tripDiv);

    // Main content div
    var content = document.createElement("div");
    content.classList.add("taskContent");
    tripDiv.appendChild(content)

    // Title
    var title = document.createElement("label");
    title.innerHTML = trip.title;
    title.htmlFor = tripDiv.id;
    title.classList.add("taskName");
    content.appendChild(title);

    content.appendChild(document.createElement("br"));

    // Footer
    var bottomDiv = document.createElement("div");
    bottomDiv.classList.add("bottomBar");
    tripDiv.appendChild(bottomDiv);

    // Destination Label
    var destination = document.createElement("label");
    destination.classList.add("priority")
    destination.innerHTML = (trip.city ? trip.city + ", " : "") + (trip.country ? trip.country + ", " : "") + trip.region;
    bottomDiv.appendChild(destination);

    // Join Button
    var joinBtn = document.createElement("input");
    joinBtn.type = "button";
    joinBtn.classList.add("btnEmbed");
    joinBtn.value = "Join";
    joinBtn.addEventListener("click", joinTripBtnClick);
    bottomDiv.appendChild(joinBtn);
}

function setCurrentTrip(id) { // Add an option for if the use has no trips
    currentTripId = id;

    console.log(trips);

    // Remove old task elements
    for (var i = 0; i < tasks.length; i++)
        document.getElementById(tasks[i]._id).remove();

    tripIndex = 0;
    for (var i = 0; i < trips.length; i++) {
        if (trips[i]._id == id) {
            trip = trips[i];
            tripIndex = i;
        }
    }

    tasks = trip.tasks;

    // Create new task elements
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].date = new Date(tasks[i].date);
        createTaskElement(tasks[i])
    }

    firstNames = [];
    for (var i = 0; i < userNames[tripIndex].length; i++) {
        firstNames.push(userNames[tripIndex][i].firstName);
    }
    
    var assignSelector = document.getElementById("newTaskAssign");
    // Remove all assign options
    while (assignSelector.firstChild) assignSelector.removeChild(assignSelector.firstChild);
    // Add assign options
    for (var i = 0; i < firstNames.length; i++) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = firstNames[i];
        assignSelector.appendChild(opt);
    };

    document.getElementById("currentTripTitle").innerHTML = trip.title;
    document.body.style.backgroundImage = "url(/images/" + trip.region.replace(/ /g,'') + ".jpg)";

    refreshTasks();
}

// Order the tasks according to the dropbox
function refreshTasks(){
    tasks = tasks.sort([compareTime, comparePriority, compareAssignment, compareDone][document.getElementById("orderBy").value]);
    var mainDiv = document.getElementById("main");
    tasks.forEach(t => {
        mainDiv.appendChild(document.getElementById(t._id));
    });

    i = 0;
    tasks.forEach(t => {if (!t.done) i++;});
    document.getElementById("taskCount").innerHTML = "Task Count: " + tasks.length;
    document.getElementById("tasksRemain").innerHTML = "Remaining Tasks: " + i;
    document.getElementById("modTime").innerHTML = "Modified " + new Date().toLocaleString();
}



// Toggles ============================================================

function toggleAboutDisplay(){
    var e = document.getElementById("aboutBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleSettingsDisplay(){
    var e = document.getElementById("settingsBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleNewTripDisplay(){
    var e = document.getElementById("newTripBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleMatchDisplay(){
    var e = document.getElementById("matchBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleNewTask() {
    var content = document.getElementById("addTaskContent");
    var cover = document.getElementById("addTaskCover");

    if (content.style.display == "none") {
        content.style.display = "grid";
        cover.style.display = "none";
    }
    else {
        content.style.display = "none";
        cover.style.display = "block";
    }
}

// Task Sorting Functions =============================================

function compareTime(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? 1 : -1) : (a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
}

function comparePriority(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? 1 : -1) : (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
}

function compareAssignment(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? 1 : -1) : (a.assign < b.assign ? -1 : a.assign > b.assign ? 1 : (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0));
}

function compareDone(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? -1 : 1) : (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0);
}



// Helpful Routines ===================================================

function setTaskColor(task) {
    document.getElementById(task._id).style.backgroundColor = task.done ? "lightgreen" : ["red", "white", "lightgray"][task.priority];
}

// Inserts an element after a reference node.
function insertAfter(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Convert a date to dd/mm/yyyy
function dateToAussieString(d){
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

// Conervt a date to full time
function dateToFullAussieString(d){
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

// Add a delete function for elements
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

// Remove 
Element.prototype.removeAllChildren = function() {
    while (this.firstChild)
        this.removeChild(this.firstChild);
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});



// Vibrant.js

// img.addEventListener('load', function() {
//     var vibrant = new Vibrant(img);
//     var swatches = vibrant.swatches()
//     for (var swatch in swatches)
//         if (swatches.hasOwnProperty(swatch) && swatches[swatch])
//             console.log(swatch, swatches[swatch].getHex())

//     /*
//      * Results into:
//      * Vibrant #7a4426
//      * Muted #7b9eae
//      * DarkVibrant #348945
//      * DarkMuted #141414
//      * LightVibrant #f3ccb4
//      */
// });