window.onload=()=>{
    iconsUpdate()
    iconsUpdate()
    //const map = document.getElementById("map");
    let isDragging = false;
    let startX, startY, offsetX = 0, offsetY = 0;
    let scale = 1;
    let prevscale = 1;
    let mouseX;
    let mouseY;


    map.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Prevent default drag behavior
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        map.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        //&&offsetX>window.innerWidth/2-window.innerWidth*scale/2&&offsetX+window.innerWidth<window.innerWidth/2+window.innerWidth*scale/2&&offsetY>window.innerHeight/2-window.innerHeight*scale/2&&offsetY+window.innerHeight<window.innerHeight/2+window.innerHeight*scale/2
        if (isDragging){
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
            iconsUpdate()
            console.log(offsetY)
        } else {
            return;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        map.style.cursor = "grab";
    });

    document.addEventListener("wheel", (e) => {
        e.preventDefault();
        let zoomFactor = 0.1;
        scale += e.deltaY > 0 ? -zoomFactor : zoomFactor;
        scale = Math.min(Math.max(0.9, scale), 10); // Limit zoom levels
        offsetX = offsetX - (scale-prevscale)/prevscale*((mouseX - offsetX - window.innerWidth/2))
        offsetY = offsetY - (scale-prevscale)/prevscale*((mouseY - window.innerHeight*0.15 - offsetY - window.innerHeight*0.85/2))
        map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        prevscale = scale;
        
        iconsUpdate()
    });

    function iconsUpdate(){
        document.querySelectorAll(".mapIconLocator").forEach(elem=>{
            let location = elem.id.slice(14,elem.id.length)
            coordinate = elem.getBoundingClientRect()
            let container = document.getElementById("mapIconContainer"+location)
            container.style.left = coordinate.left-window.innerHeight*0.015
            container.style.bottom = window.innerHeight*0.985-coordinate.top
        })
    }   
}