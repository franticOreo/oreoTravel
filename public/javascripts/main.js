window.onload = function() {
    document.getElementById("newTaskDate").value = new Date().toDateInputValue();

    var assignSelector = document.getElementById("newTaskAssign");
    
    for (var i = 0; i < people.length; i++) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = people[i];
        assignSelector.appendChild(opt);
    };

    document.getElementById("newTaskDesc").innerHTML = "";

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

    getTrips();

    getMatches();
}

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

// --------------------------------------------------------------------------------------------------------

var tasks = [];
var idTick = 0;
var people = ["Eric", "Gwin", "Tails"];
var currentTripId;
var trips = [];

function getMatches() {
    var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = handleTripsResponse;
    xhttp.open("GET", "/dash/search", true);
    xhttp.send();
}

function setCurrentTrip(id) { // Add an option for if the use has no trips
    currentTripId = id;

    // Remove old task elements
    for (var i = 0; i < tasks.length; i++)
        document.getElementById(tasks[i]._id).remove();

    tasks = trips.find(t => { return t._id == id; }).tasks;

    // Create new task elements
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].date = new Date(tasks[i].date);
        createTaskElement(tasks[i]);
    }
    refreshTasks();
}

function task(name, description, priority, date, assign){
    this._id = 0;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.date = date;
    this.assign = assign;
    this.done = false;
    return this;
}

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

function handleTripsResponse() {
    if (this.readyState == 4 && this.status == 200) {
        trips = JSON.parse(this.responseText);
        if (trips[0]){
            setCurrentTrip(trips[0]._id);
        }
        refreshTasks();
    }
}

function addTask(id) {
    var t = new task(
        document.getElementById("newTaskName").value,
        document.getElementById("newTaskDesc").innerHTML,
        document.getElementById("newTaskPriority").value,
        new Date(document.getElementById("newTaskDate").value),
        document.getElementById("newTaskAssign").value
    );

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("POST", "/dash/task/" + id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(t));
}

function deleteTask(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleTaskResponse;
    xhttp.open("DELETE", "/dash/task/" + currentTripId + "/" + id, true);
    xhttp.send({ tripId: currentTripId });
    setCurrentTrip(currentTripId);
}

function handleTaskResponse() {
    if (this.readyState == 4 && this.status == 200) {
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

// Create the elements that display a task
function createTaskElement(task){
    taskDiv = document.createElement("div");
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
    priority.classList.add("priority")
    priority.innerHTML = dateToAussieString(task.date) + " - " + people[task.assign] + " - " + ["High", "Medium", "Optional"][task.priority];
    bottomDiv.appendChild(priority);

    // Done Button
    var doneBtn = document.createElement("input");
    doneBtn.type = "button";
    doneBtn.classList.add("btnEmbed");
    doneBtn.value = "Done";
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

// Reorder the tasks according to the dropbox
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

function doneTaskBtnClick(){
    taskDiv = this.parentNode.parentNode;
    id = parseInt(taskDiv.id.match("[0-9]+")[0]);

    tasks.forEach(t => {
        if (t.id == id){
            t.done = !t.done;
            this.value = t.done ? "Undo" : "Done";
            setTaskColor(t);
        }
    });

    refreshTasks();
}

function deleteTaskBtnClick(){
    taskDiv = this.parentNode.parentNode;
    deleteTask(taskDiv.id);
}



/* --- Task Sorting Functions --- */

function compareTime(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? 1 : -1) : (a.date > b.date ? -1 : a.date < b.date ? 1 : 0);
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



/* --- Helpful Routines --- */

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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});