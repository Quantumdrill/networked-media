window.onload=()=>{
    Btn1.addEventListener("click",()=>{
        let changeclslst = change.classList
        if (changeclslst.contains("day")){
            changeclslst.add("night")
            changeclslst.remove("day")
        } else {
            changeclslst.remove("night")
            changeclslst.add("day")
        }
    })
}