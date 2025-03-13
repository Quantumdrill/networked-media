window.onload=()=>{
    for (let i=0;i<20;i++){
        setTimeout(()=>{
            const pic = document.createElement("img")
            pic.classList.add("ppBG")
            pic.setAttribute("src","pigeon.svg")
            pic.style.height=`${Math.random()*7+8}vh`
            //pic.style.display="none"
            ppImgs.appendChild(pic)
        },70*i)
    };
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
    ppFilterText.addEventListener("click",()=>{
        anime({
            targets: "#ppFilterMenu",
            top: "0vh",
            duration: 300,
            easing: 'easeInOutExpo',
        })
        ppFilterCover.style.display="block";
        ppFilterCoverHeader.style.display="block";   
    })
    ppFilterCover.addEventListener("click",()=>{
        anime({
            targets: "#ppFilterMenu",
            top: "-23vh",
            duration: 300,
            easing: 'easeInOutExpo',
        })
        ppFilterCover.style.display="none";
        ppFilterCoverHeader.style.display="none";
    })
    ppFilterCoverHeader.addEventListener("click",()=>{
        anime({
            targets: "#ppFilterMenu",
            top: "-23vh",
            duration: 300,
            easing: 'easeInOutExpo',
        })
        ppFilterCover.style.display="none";
        ppFilterCoverHeader.style.display="none";
    })
}