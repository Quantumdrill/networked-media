function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB,100)
  noStroke()
  frameRate(60)
  fireworks = []
  a = 0
}

function mouseReleased(){
  fireworks.push(new Firework(mouseX,mouseY))
  a += 1
}


function draw(){
  background(0,0,20)
  if (a>0.5){
    for (let firework of fireworks){
      firework.drawing()
    }
    if (fireworks.length >0 && fireworks[0].fc > 200){ //removed the disappeared element from array
      fireworks.shift()
    }
  }
}

class Firework{
  constructor(x,y){
    this.xm = x // mouse x
    this.ym = y // mouse y
    this.ss = random(0.3,2) // star initial speed
    this.rs = random(0.5,1.5) // rocket x speed
    this.sc = round(random(20,28)) // star split count
    this.rdir = random([1,2,3,4]) // rocket trajectory type: 1 = left w/ fall, 2 = left w/o fall, 3 = right w/ fall, 4 = right w/o fall
    this.rt = random(0,25) // rocket trajectory: sin function amplitude - mouse y
    this.rw = random(30,50) // rocket trajectory width ratio
    this.g = 0.003 // gravity
    this.x = 0 // x value in the sine
    this.c = color(random([random(0,15),random(85,100)]),random(70,100),random(70,100),100) // random color
    this.fc = 1 // initial frame counter
    this.fcl = 70 // trail length
    this.fcu = 80 // trail disappearing frame
    
    this.size = random(4,8) // size of the rocket (size of star = size * 0.7)
    
    this.x00 = this.rw*asin((600-this.ym)/(600-this.ym+this.rt))
    
    if (this.rdir === 1){
      this. x0 = this.xm - (PI*this.rw-this.x00)
    } else if (this.rdir === 2){
      this. x0 = this.xm - this.x00
    } else if (this.rdir === 3){
      this. x0 = this.xm + (PI*this.rw-this.x00)
    } else { 
      this. x0 = this.xm + this.x00
    }
    
    this.xs = new Array(this.sc).fill(this.xm) // star x array
    this.ys = new Array(this.sc).fill(this.ym) // star y array
    this.xss = [] // star x speed array
    this.yss = [] // star y speed array
    for (let i=0;i<this.sc;i++){ // making star speed array for all directions
      this.xss.push(cos(i*TWO_PI/this.sc)*this.ss)
      this.yss.push(sin(i*TWO_PI/this.sc)*this.ss)
    }
  }
  
  
  drawing(){
    fill(this.c)
    // rocket trajectory
    if (this.x+this.x0<this.xm-2 || this.x+this.x0>this.xm+2){ 
      if (this.rdir === 1 || this.rdir === 2){ // left or right
        circle(this.x+this.x0,600-(600-this.ym+this.rt)*sin(this.x/this.rw),this.size)
        this.x += this.rs
      } else {
        circle(this.x+this.x0,600+(600-this.ym+this.rt)*sin(this.x/this.rw),this.size)
        this.x -= this.rs
      }
    }
    // star
    if (this.x+this.x0>this.xm-2 && this.x+this.x0<this.xm+2){ 
      
      if (this.fc < this.fcl){ // 1st phase: current length shorter than trail length
        for (let t=0;t<this.fc;t++){
          for (let i=0;i<this.sc;i++){
            if (random([-1,1])>0){
            circle(this.xs[i]+this.xss[i]*t,this.ys[i]+(this.yss[i]+this.g*t)*t,this.size*0.4)
            }
          }
        }
      }
      if (this.fc >= this.fcl && this.fc < this.fcu){ // 2nd phase: current length = trail length
        for (let i=0;i<this.sc;i++){
          for (let t=0;t<this.fcl;t++){
            if (random([-1,1])>0){
            circle(this.xs[i]+this.xss[i]*t,this.ys[i]+(this.yss[i]+this.g*t)*t,this.size*0.4)
            }
          }
          this.xs[i] += this.xss[i]
          this.ys[i] += this.yss[i]
          this.yss[i] += this.g
        }
      }
      if (this.fc >= this.fcu){ // 3rd phase: disappearing
        fill(hue(this.c),saturation(this.c),brightness(this.c),100-2*(this.fc-this.fcu))
        for (let i=0;i<this.sc;i++){
          for (let t=0;t<this.fcl;t++){
            if (random([-1,1])>0){
            circle(this.xs[i]+this.xss[i]*t,this.ys[i]+(this.yss[i]+this.g*t)*t,this.size*0.4)
            }
          }
          this.xs[i] += this.xss[i]
          this.ys[i] += this.yss[i]
          this.yss[i] += this.g
        }
        
      }
      this.fc += 1
    }
  }
}