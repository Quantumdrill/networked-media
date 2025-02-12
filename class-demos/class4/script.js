window.onload=()=>{
    console.log("page has loaded");
    init();
}
function init(){
    alert("called init function");
    document.getElementById("container").style.backgroundColor = "pink"
}