import * as THREE from "three"
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'


//initialize
const scene = new THREE.Scene()
const canvas = document.getElementById("roamCanvas")
const scrnSize = {w:window.innerWidth,h:window.innerHeight}
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true
renderer.setSize(scrnSize.w,scrnSize.h)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
const cam = new THREE.PerspectiveCamera(60, scrnSize.w/scrnSize.h)
scene.add(cam)
window.addEventListener("resize",()=>{
    camctrl.handleResize()
    scrnSize.w = window.innerWidth
    scrnSize.h = window.innerHeight
    cam.aspect = scrnSize.w/scrnSize.h
    cam.updateProjectionMatrix()
    renderer.setSize(scrnSize.w,scrnSize.h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

//loaders
const objLoader = new OBJLoader()
const texLoader = new THREE.TextureLoader()
const rgbeLoader = new RGBELoader()

//custom variables
let sceneSizeMultiplier = 50
let minimumDistanceBetweenObjects = 40
let movementSpeed = 10
let sceneFlatness = 6
let interactionDist = 15
let nearestObj
let camCtrlEnabled = true
let menuOn = false
let viewOn = false

//camera control
const camctrl = new FirstPersonControls(cam,canvas)
camctrl.handleResize()
camctrl.lookSpeed = 0.14
camctrl.movementSpeed = movementSpeed
scene.add(camctrl)

//key controls
document.addEventListener("keyup",(e)=>{
    if (e.key==="Escape"&&viewOn===false) {
        toggleCamCtrl()
        toggleMenu()
    } else if (nearestObj&&e.key.toLowerCase()==="e"&&menuOn===false){
        toggleCamCtrl()
        toggleView()
    }
})
function toggleCamCtrl(){
    if (camCtrlEnabled === true){
        camctrl.activeLook = false
        camctrl.movementSpeed = 0
        camCtrlEnabled = false
    } else {
        camctrl.activeLook = true
        camctrl.movementSpeed = movementSpeed
        camCtrlEnabled = true
    }
}
let escMenu = document.getElementsByClassName("escMenu")
function toggleMenu(){
    if (menuOn === false){
        Array.from(escMenu).forEach(elem=>{elem.style.display="flex"})
        menuOn = true
    } else {
        Array.from(escMenu).forEach(elem=>{elem.style.display="none"})
        menuOn = false
    }
}
function toggleView() {
    if (viewOn === false){
        roamViewContainer.style.display = "flex"
        displayView()
        viewOn = true
    } else {
        roamViewContainer.style.display = "none"
        viewOn = false
    }
}
function displayView() {
    roamViewText.textContent = ""
    Array.from(document.getElementsByClassName("roamViewPic")).forEach(elem=>{
        roamViewBorder.removeChild(elem)
    })
    switch (nearestObj.type){
        case "text":
            roamViewText.textContent = nearestObj.textContent
            break
        case "image":
            for (let i=0;i<nearestObj.fileUrl.length;i++){
                let pic = document.createElement("img")
                pic.setAttribute("src","uploads/"+nearestObj.fileUrl[i])
                pic.classList.add("roamViewPic")
                roamViewBorder.appendChild(pic)
                
            }
    }
}

//lighting
texLoader.load("hdri.png",tex=>{
    objLoader.load("3Dassets/dome.obj",obj=>{
        const domeMat = new THREE.MeshBasicMaterial({ map: tex})
        domeMat.side = THREE.DoubleSide
        obj.children[0].material = domeMat
        scene.add(obj)
        obj.scale.set(10,10,10)
    })
})



//data processing and object scattering
let dataForRender = []
if(data.length<100){
    dataForRender = data
} else {
    while (dataForRender.length<100){
        data.forEach(elem=>{
            if (Math.random>0.5){
                dataForRender.push(elem)
            }
        })
    }
}
let contentCoord = []
dataForRender.forEach(elem=>{
    let creationSuccess = false
    while (creationSuccess === false){
        let phi = Math.random()*2*Math.PI
        let theta = Math.random()*Math.PI-Math.PI/2
        let rho = Math.random()*Math.cbrt(dataForRender.length)*sceneSizeMultiplier
        let yCoord = rho*Math.sin(theta)/sceneFlatness
        let xCoord = rho*Math.cos(theta)*Math.cos(phi)
        let zCoord = rho*Math.cos(theta)*Math.sin(phi)
        let vec3 = new THREE.Vector3(xCoord,yCoord,zCoord)
        let check = false
        contentCoord.forEach(elem=>{
            if (vec3.distanceTo(elem)<minimumDistanceBetweenObjects){
                check = true
            }
        })
        if (check === false){
            contentCoord.push(vec3)
            creationSuccess = true
        }
    }
})
for (let i=0;i<dataForRender.length;i++){
    switch (dataForRender[i].type){
        case "image":
            createPhotoFrame(contentCoord[i],dataForRender[i])
            break
    }
}

//test
// const geo = new THREE.SphereGeometry(1)
// mat.shineness = 80
// mat.specular = new THREE.Color(0xeeeeee)
// const mesh = new THREE.Mesh(geo, mat)
// mesh.position.z = -3
//scene.add(mesh)
const lt = new THREE.DirectionalLight(new THREE.Color(0xd19a19), 4)
const ltHemi = new THREE.HemisphereLight(new THREE.Color(0x390E4D),new THREE.Color(0x0A073E), 10)
const ltAmb = new THREE.AmbientLight(new THREE.Color(0xd19a19), 0.21)
lt.position.x = -10
lt.position.z = 3
lt.castShadow = true
scene.add(lt)
scene.add(ltHemi,ltAmb)


//makeshift mat
const mat = new THREE.MeshPhongMaterial({color:0xdddddd})
mat.shineness = 50
mat.specular = new THREE.Color(0xeeeeee)

//photoframe
function createPhotoFrame(coord,data){
    const grpPhotoFrame = new THREE.Group()
    texLoader.load("uploads/"+data.fileUrl,tex=>{
        tex.center.set(0.5, 0.5)
        let ratio = tex.image.width/tex.image.height/(4/3)
        objLoader.load("3Dassets/photoframe.obj",obj=>{
            obj.receiveShadow = true
            obj.castShadow = true
            obj.children[0].material = mat
            obj.scale.set(0.05,0.05,0.05)
            grpPhotoFrame.add(obj)
        })
        objLoader.load("3Dassets/photoframePhoto.obj",obj=>{
            obj.receiveShadow = true
            obj.castShadow = true
            const mat = new THREE.MeshPhongMaterial({map:tex})
            obj.children[0].material = mat
            obj.scale.set(0.05,0.05,0.05)
            grpPhotoFrame.add(obj)
        })
        if (tex.image.width/tex.image.height<1){
            tex.rotation = Math.PI/2
            ratio = tex.image.width/tex.image.height/(3/4)
            grpPhotoFrame.rotation.z = -Math.PI/2
        }
        if (ratio>1){
            tex.repeat.set(ratio, 1)
        } else {
            tex.repeat.set(1, ratio)
        }
    })
    grpPhotoFrame.position.copy(coord)
    grpPhotoFrame.rotation.y = Math.random()*Math.PI*2
    grpPhotoFrame.rotation.x = Math.random()*Math.PI/6-Math.PI/12
    scene.add(grpPhotoFrame)
}

//check distance


//tick
const clock = new THREE.Clock()
const tick = ()=>{
    camctrl.update(clock.getDelta())
    for (let i=0;i<contentCoord.length;i++){
        if (cam.position.distanceTo(contentCoord[i])<interactionDist){
            nearestObj = dataForRender[i]
            roamHUDCenter.style.display = "block"
            break
        } else {
            nearestObj = ""
            roamHUDCenter.style.display = "none"
        }
    }
    renderer.render(scene,cam)
    window.requestAnimationFrame(tick)
}
tick()