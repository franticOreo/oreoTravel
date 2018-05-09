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

    refreshTasks();
}

function toggleAboutDisplay(){
    var e = document.getElementById("aboutBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

var tasks = [];
var idTick = 0;
var people = ["Eric", "Gwin", "Tails"];

function task(name, details, priority, time, assign){
    this.id = idTick++;
    this.name = name;
    this.details = details;
    this.priority = priority;
    this.time = time;
    this.assign = assign;
    this.done = false;
    return this;
}

function addTask(btn){
    var i = tasks.push(new task(
        document.getElementById("newTaskName").value,
        document.getElementById("newTaskDesc").innerHTML,
        document.getElementById("newTaskPriority").value,
        new Date(document.getElementById("newTaskDate").value),
        document.getElementById("newTaskAssign").value
    ));

    createTaskElement(tasks[i - 1]);

    refreshTasks();
}

// Create the elements that display a task
function createTaskElement(task){
    taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "paper");
    taskDiv.id = "task_" + task.id;
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
    var details = document.createElement("label");
    details.innerHTML = task.details;
    details.classList.add("taskDetails");
    content.appendChild(details);

    // Task Footer
    var bottomDiv = document.createElement("div");
    bottomDiv.classList.add("bottomBar");
    taskDiv.appendChild(bottomDiv);

    // Priority Label
    var priority = document.createElement("label");
    priority.classList.add("priority")
    priority.innerHTML = dateToAussieString(task.time) + " - " + people[task.assign] + " - " + ["High", "Medium", "Optional"][task.priority];
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
    delBtn.addEventListener("click", deleteTaskBtnClick);
    bottomDiv.appendChild(delBtn);

    setTaskColor(task);
}

// Reorder the tasks according to the dropbox
function refreshTasks(){
    console.log(document.getElementById("orderBy").value);
    tasks = tasks.sort([compareTime, comparePriority, compareAssignment, compareDone][document.getElementById("orderBy").value]);
    console.log(tasks);
    var mainDiv = document.getElementById("main");
    tasks.forEach(t => {
        mainDiv.appendChild(document.getElementById("task_" + t.id));
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
    id = parseInt(taskDiv.id.match("[0-9]+")[0]);

    tasks = tasks.filter(function(t) {
        return t.id != id;
    })

    taskDiv.remove();

    refreshTasks();
}



/* --- Task Sorting Functions --- */

function compareTime(a, b){
    return (a.done ? !b.done : b.done) ? (a.done ? 1 : -1) : (a.time > b.time ? -1 : a.time < b.time ? 1 : 0);
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
    document.getElementById("task_" + task.id).style.backgroundColor = task.done ? "lightgreen" : ["red", "white", "lightgray"][task.priority];
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