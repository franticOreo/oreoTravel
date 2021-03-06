window.onload = function(){
    this.document.getElementById("loginBtn").addEventListener("click", toggleLoginDisplay);
    this.document.getElementById("loginBlanket").addEventListener("click", function(e){
        if (!document.getElementById("loginPage").contains(e.target)) toggleLoginDisplay();
    });
    this.document.getElementById("signupBtn").addEventListener("click", toggleSignupDisplay);
    this.document.getElementById("signupBlanket").addEventListener("click", function(e){
        if (!document.getElementById("signupPage").contains(e.target)) toggleSignupDisplay();
    });
    this.document.getElementById("aboutBtn").addEventListener("click", toggleAboutDisplay);
    this.document.getElementById("aboutBlanket").addEventListener("click", function(e){
        if (!document.getElementById("aboutPage").contains(e.target)) toggleAboutDisplay();
    });
    
    var countries = ["Africa", "Antarctica", "Asia", "Australia-Oceania", "Caribean", "CentralAmerica", "Europe", "Islands", "MiddleEast", "NorthAmerica", "SouthAmerica"]
    document.body.style.backgroundImage = "url(/images/" + countries[Math.floor(Math.random()*countries.length)] + ".jpg)";
}

function toggleLoginDisplay(){
    var e = document.getElementById("loginBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleSignupDisplay(){
    var e = document.getElementById("signupBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}

function toggleAboutDisplay(){
    var e = document.getElementById("aboutBlanket");
    e.style.display == "none" ? e.style.display = "block" : e.style.display = "none";
}