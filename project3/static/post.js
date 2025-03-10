window.onload=()=>{
    ppWritePost.addEventListener("click",()=>{
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
}