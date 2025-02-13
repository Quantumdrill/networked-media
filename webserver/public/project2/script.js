let prevShichen
let darkMode = true

window.onload=()=>{
    //timeLapseTester()
    initialize()
    setInterval(intervalSec,1000)
}

function initialize(){
    //similar to the intervalSec func but without the updating part
    let currDate = new Date()
    let currTime = currDate.toLocaleTimeString()
    let currTimePrecise = (Number(currTime.slice(0,2))+Number(currTime.slice(3,5))/60+Number(currTime.slice(6,8))/3600)/24
    chineseTime = timeToChinese(currTime)
    let shichenIndex = (currTime.slice(0,2))>22?0:Math.floor((Number(currTime.slice(0,2))+1)/2)
    prevShichen = shichenIndex
    timeNumH.textContent = chineseTime[0]
    timeNumM.textContent = chineseTime[1]
    timeNumS.textContent = chineseTime[2]
    timeNumerical.textContent = currTime
    bodyID.style.backgroundColor = `hsl(${shichenIndex*360/12},70%,8%)`
    shichen.textContent = timeToShichenDictionary(shichenIndex)[0]
    shichenEn.textContent = "The Hour of the "+timeToShichenDictionary(shichenIndex)[1]
    sundialR1.style.top = `${-26.5-currTimePrecise*143.5}vh`
    sundialR2.style.top = `${117.5-currTimePrecise*143.5}vh`
    sundialL1.style.top = `${-26.5-currTimePrecise*143.5}vh`
    sundialL2.style.top = `${117.5-currTimePrecise*143.5}vh`
    lightModeBtn.addEventListener("click",()=>{
        darkMode = !darkMode
        console.log(darkMode)
        if (darkMode === true){
            timeFlex.style.color = "#d1d1d1"
            timeNumerical.style.color = "#d1d1d1"
            Array.from(document.getElementsByClassName("sundialImagesB")).forEach(elem=>{elem.style.display = "none"})
            Array.from(document.getElementsByClassName("sundialImagesW")).forEach(elem=>{elem.style.display = "block"})
            Array.from(document.getElementsByClassName("shichenWord")).forEach(elem=>{elem.style.color = "hsla(0,0%,100%,15%)"})
            Array.from(document.getElementsByClassName("sundialNum")).forEach(elem=>{elem.style.color = "hsla(0,0%,100%,15%)"})
            sundialNeedleR.style.backgroundColor = "hsla(0,0%,100%,15%)"
            sundialNeedleL.style.backgroundColor = "hsla(0,0%,100%,15%)"
            shichenEn.style.color = "hsla(0,0%,100%,15%)"
            bodyID.style.backgroundColor = `hsl(${shichenIndex*360/12},70%,8%)`
            lightModeBtn.style.color = "#fff"
            lightModeBtn.textContent = "Light Mode"
        } else {
            timeFlex.style.color = "#1f1f1f"
            timeNumerical.style.color = "#1f1f1f"
            Array.from(document.getElementsByClassName("sundialImagesB")).forEach(elem=>{elem.style.display = "block"})
            Array.from(document.getElementsByClassName("sundialImagesW")).forEach(elem=>{elem.style.display = "none"})
            Array.from(document.getElementsByClassName("shichenWord")).forEach(elem=>{elem.style.color = "hsla(0,0%,0%,15%)"})
            Array.from(document.getElementsByClassName("sundialNum")).forEach(elem=>{elem.style.color = "hsla(0,0%,0%,15%)"})
            sundialNeedleR.style.backgroundColor = "hsla(0,0%,0%,15%)"
            sundialNeedleL.style.backgroundColor = "hsla(0,0%,0%,15%)"
            shichenEn.style.color = "hsla(0,0%,0%,15%)"
            bodyID.style.backgroundColor= `hsl(${shichenIndex*360/12},70%,92%)`
            lightModeBtn.style.color = "#111"
            lightModeBtn.textContent = "Dark Mode"
        }
    })
}
function intervalSec(testTime){
    let currDate = new Date()
    let currTime = currDate.toLocaleTimeString()
    //let currTime = testTime
    let currTimePrecise = (Number(currTime.slice(0,2))+Number(currTime.slice(3,5))/60+Number(currTime.slice(6,8))/3600)/24
    chineseTime = timeToChinese(currTime)
    let shichenIndex = (currTime.slice(0,2))>22?0:Math.floor((Number(currTime.slice(0,2))+1)/2)
    timeNumH.textContent = chineseTime[0]
    timeNumM.textContent = chineseTime[1]
    timeNumS.textContent = chineseTime[2]
    timeNumerical.textContent = currTime
    // the symbols on the sides rolls with time:
    sundialR1.style.top = `${-26.5-currTimePrecise*143.5}vh`
    sundialR2.style.top = `${117.5-currTimePrecise*143.5}vh`
    sundialL1.style.top = `${-26.5-currTimePrecise*143.5}vh`
    sundialL2.style.top = `${117.5-currTimePrecise*143.5}vh`
    // updating with animation when hour changes
    if (shichenIndex!==prevShichen){
        anime({
            targets: "#shichen",
            rotate: {
                value: "-15deg",
                duration: 300,
            },
            opacity: {
                value: "0",
                duration: 300,
            },
            easing: 'easeInOutExpo'
        });
        if (darkMode===true) {
            anime({
                targets: "#bodyID",
                backgroundColor: `hsl(${shichenIndex*360/12},70%,8%)`,
                duration: 400,
                easing: 'easeInOutExpo'
            });
        } else {
            anime({
                targets: "#bodyID",
                backgroundColor: `hsl(${shichenIndex*360/12},70%,92%)`,
                duration: 400,
                easing: 'easeInOutExpo'
            });
        }
        setTimeout(()=>{
            anime({
                targets: "#shichen",
                rotate: {
                    value: ["15deg","0deg"],
                    duration: 300,
                },
                opacity: {
                    value: ["0","100%"],
                    duration: 300,
                },
                easing: 'easeInOutExpo'
            });
            shichen.textContent = timeToShichenDictionary(shichenIndex)[0]
            shichenEn.textContent = "The Hour of the "+timeToShichenDictionary(shichenIndex)[1]
        }, 300)
    }

    prevShichen = shichenIndex
}

function timeToChinese(input){
    let timearr = [Number(input.slice(0,2)),Number(input.slice(3,5)),Number(input.slice(6,8))]
    let chinesearr = []
    timearr.forEach(elem => {
        if (elem%10===0&&elem!==0&&elem!==10){
            chinesearr.push(numberToChineseDictionary(elem/10)+"十")
        } else if (elem===10){
            chinesearr.push("十")
        } else if (elem<10){
            chinesearr.push(numberToChineseDictionary(elem))
        } else if (elem<20) {
            chinesearr.push("十"+numberToChineseDictionary(elem%10))
        } else {
            chinesearr.push(numberToChineseDictionary(Math.floor(elem/10))+"十"+numberToChineseDictionary(elem%10))
        }
    })
    return chinesearr
}
function numberToChineseDictionary(input){
    switch (input) {
        case 0:
            return "零";
            break;
        case 1:
            return "一";
            break;
        case 2:
            return "二";
            break;
        case 3:
            return "三";
            break;
        case 4:
            return "四";
            break;
        case 5:
            return "五";
            break;
        case 6:
            return "六";
            break;
        case 7:
            return "七";
            break;
        case 8:
            return "八";
            break;
        case 9:
            return "九";
            break;
    }
}
function timeToShichenDictionary(input){
    switch (input){
        case 0:
            return ["子","Rat"]
            break;
        case 1:
            return ["丑","Ox"]
            break;
        case 2:
            return ["寅","Tiger"]
            break;
        case 3:
            return ["卯","Rabbit"]
            break;
        case 4:
            return ["辰","Dragon"]
            break;
        case 5:
            return ["巳","Snake"]
            break;
        case 6:
            return ["午","Horse"]
            break;
        case 7:
            return ["未","Goat"]
            break;
        case 8:
            return ["申","Monkey"]
            break;
        case 9:
            return ["酉","Rooster"]
            break;
        case 10:
            return ["戌","Dog"]
            break;
        case 11:
            return ["亥","Pig"]
            break;
    }
}
function timeLapseTester(){
    let time = [0,0]
    setInterval(()=>{
        time[1]+=1
        if(time[1]>59){time[0]+=1;time[1]=0}
        if(time[0]>23){time[0]=0}
        let hour
        let minute
        if(time[0]>9){hour=String(time[0])}else{hour="0"+String(time[0])}
        if(time[1]>9){minute=String(time[1])}else{minute="0"+String(time[1])}
        let currTime = hour+":"+minute+":00"
        intervalSec(currTime)
    },20)
}