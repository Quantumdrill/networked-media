let homeClicked = false
document.addEventListener("click",()=>{
    if (homeClicked === false){
        let tl = gsap.timeline()
        tl.to("#hmHContainer",{opacity:0, duration:1})
        tl.to("#hmOptionsContainer",{opacity:1, duration:1})
        homeClicked = true
    }
})