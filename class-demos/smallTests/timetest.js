window.onload=()=>{
    let now = new Date()
    let timeDisp = new Intl.DateTimeFormat("en-GB",{
        hour12: false,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(now)

    timeDispDiv.textContent = timeDisp
}