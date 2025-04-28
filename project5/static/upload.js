let fileType
upFileTypes.addEventListener("change",e=>{
    fileType = e.target.value
    switch (e.target.value){
        case "image":
            upH2TextFile.textContent = "Upload Image"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            upTextArea.placeholder = "Write your text here"
            break;
        case "text":
            upH2TextFile.textContent = "Enter text"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "none"
            break;
        case "audio":
            upH2TextFile.textContent = "Upload Audio"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            break;
        case "video":
            upH2TextFile.textContent = "Upload Video"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            break;
        case "link":
            upH2TextFile.textContent = "Enter link"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "none"
            upTextArea.placeholder = "Paste your link here"
            break;
        case "model":
            upH2TextFile.textContent = "Upload 3D model (.OBJ Only)"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            break;
        case "textImage":
            upH2TextFile.textContent = "Write text and Upload Image"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "block"
            upTextArea.placeholder = "Write your text here"
            break;
    }
})

upFileUpload.addEventListener("change",e=>{
    Object.keys(upFileUpload.files).forEach((key)=>{
        const fileSize = upFileUpload.files[key] ? upFileUpload.files[key].size : 0
        if (upFileUpload.files[key].size > 10 * 1024 * 1024){
            alert("File must be under 10 MB") 
            upFileUpload.value = ""
        }
    })
})

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