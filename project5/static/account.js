const query = new URLSearchParams(window.location.search)
switch (query.get("err")){
    case "loginFailed":
        alert("ID and Password don't match")
        break
    case "loginRequired":
        alert("Login Required to proceed")
        break
    case "accountExists":
        alert("ID already exists")
        break
}
let menuOn = false
let escMenu = document.getElementsByClassName("escMenu")
document.addEventListener("keyup",(e)=>{
    if (e.key==="Escape") {
        toggleMenu()
    }
})
function toggleMenu(){
    if (menuOn === false){
        Array.from(escMenu).forEach(elem=>{elem.style.display="flex"})
        menuOn = true
    } else {
        Array.from(escMenu).forEach(elem=>{elem.style.display="none"})
        menuOn = false
    }
}


