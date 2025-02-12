let second =0;
const colorarr = ["red","yellow","blue","green"];
window.onload =()=>{
    setInterval(time,1000)
}
function time(){
    // console.log(second+" seconds passed");
    // second ++;
    const date = new Date()
    timetext.textContent=date.toLocaleTimeString()
}
function randomcolor (arr){
    return arr[Math.floor(Math.random()*arr.length)]
}