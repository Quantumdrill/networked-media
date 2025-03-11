window.onload=()=>{
    for (let i=0;i<20;i++){
        const pic = document.createElement("img")
        pic.classList.add("ppBG")
        pic.setAttribute("src","pigeon.svg")
        pic.style.height=`${Math.random()*7+8}vh`
        ppImgs.appendChild(pic)
    }
    ppWritePost.addEventListener("click",()=>{
        wpForm.style.display = "flex"
        wpH2.style.display = "block"
        wpSection.style.display = "block"
        anime({
            targets: "#wpSection",
            right: "0vw",
            duration: 400,
            easing: 'easeInOutExpo',
        });
        wpBackCover.style.display="block";
        anime({
            targets: "#wpBackCover",
            opacity: "60%",
            duration: 300,
            easing: 'easeInOutExpo',
        });
    })
    wpCrossImg.addEventListener("click",()=>{
        setTimeout(()=>{
            wpBackCover.style.display="none";
        },300);
        anime({
            targets: "#wpSection",
            right: "-40vw",
            duration: 400,
            easing: 'easeInOutExpo',
        });
        anime({
            targets: "#wpBackCover",
            opacity: ["60%","0%"],
            duration: 300,
            easing: 'easeInOutExpo',
        });
    })
    wpBackCover.addEventListener("click",()=>{
        setTimeout(()=>{
            wpBackCover.style.display="none";
        },300);
        anime({
            targets: "#wpSection",
            right: "-40vw",
            duration: 400,
            easing: 'easeInOutExpo',
        });
        anime({
            targets: "#wpBackCover",
            opacity: ["60%","0%"],
            duration: 300,
            easing: 'easeInOutExpo',
        });
    })
    wpSubmit.addEventListener("click",()=>{
    })

    
}