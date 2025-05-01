import * as THREE from "three"
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

//initialize
const scene = new THREE.Scene()
const canvas = document.getElementById("roamCanvas")
const scrnSize = {w:window.innerWidth,h:window.innerHeight}
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true
renderer.setSize(scrnSize.w,scrnSize.h)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
const cam = new THREE.PerspectiveCamera(60, scrnSize.w/scrnSize.h)
cam.far = 3500
cam.position.y = -50
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

//custom variables
let sceneSizeMultiplier = 50
let minimumDistanceBetweenObjects = 40
let movementSpeed = 15
let sceneFlatness = 6
let interactionDist = 15
let audioPlayDist = 80
let nearestObj = {}
let camCtrlEnabled = true
let menuOn = false
let viewOn = false
let audioArr = []

//camera control
const camctrl = new FirstPersonControls(cam,canvas)
camctrl.handleResize()
camctrl.lookSpeed = 0.14
camctrl.movementSpeed = movementSpeed
scene.add(camctrl)

//key controls
document.addEventListener("keydown",e=>{
    if (e.key==="Shift"){
        camctrl.movementSpeed = movementSpeed*2
    }
})
document.addEventListener("keyup",async e=>{
    if (e.key==="Escape"&&viewOn===false) {
        toggleCamCtrl()
        toggleMenu()
    } else if (nearestObj&&e.key.toLowerCase()==="e"&&menuOn===false){
        toggleCamCtrl()
        if (nearestObj.type==="link"){
            scene.remove(camctrl)
            if (nearestObj.text.slice(0,7)!=="http://"&&nearestObj.text.slice(0,8)!=="https://"){
                window.open("https://"+nearestObj.text) 
            } else {
                window.open(nearestObj.text) 
            }
            scene.add(camctrl)
        } else if (nearestObj.type==="audio"){
        } else { 
            toggleView()
        }
    } else if (nearestObj&&e.key.toLowerCase()==="q"&&menuOn===false){
        await fetch ("/toCollection?collected="+nearestObj._id,{method:"POST"})
    } else if (e.key==="Shift"){
        camctrl.movementSpeed = movementSpeed
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
        roamHUD.style.display = "none"
        menuOn = true
    } else {
        Array.from(escMenu).forEach(elem=>{elem.style.display="none"})
        roamHUD.style.display = "flex" 
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
            roamViewText.textContent = nearestObj.text
            break
        case "image":
            for (let i=0;i<nearestObj.fileUrl.length;i++){
                let pic = document.createElement("img")
                pic.setAttribute("src","uploads/"+nearestObj.fileUrl[i])
                pic.classList.add("roamViewPic")
                roamViewBorder.appendChild(pic)   
            }
            break
        case "textImage":
            roamViewText.textContent = nearestObj.text
            for (let i=0;i<nearestObj.fileUrl.length;i++){
                let pic = document.createElement("img")
                pic.setAttribute("src","uploads/"+nearestObj.fileUrl[i])
                pic.classList.add("roamViewPic")
                roamViewBorder.appendChild(pic)   
            }
    }
}

//lighting
const lt = new THREE.DirectionalLight(new THREE.Color(0xd19a19), 4)
const ltHemi = new THREE.HemisphereLight(new THREE.Color(0x390E4D),new THREE.Color(0x0A073E), 10)
const ltAmb = new THREE.AmbientLight(new THREE.Color(0xd19a19), 0.21)
lt.position.x = 1000
lt.position.z = 3
lt.castShadow = true
scene.add(lt)
scene.add(ltHemi,ltAmb)
texLoader.load("hdri_roam.png",tex=>{
    tex.colorSpace = THREE.SRGBColorSpace
    tex.mapping = THREE.EquirectangularReflectionMapping
    scene.background = tex
    scene.backgroundIntensity = 1.1
    scene.environment = tex
    scene.environmentIntensity = 1.4
})

//ground mesh
let GMS = {size:4000,subdivs:60} //groundMeshSizes
let GMStyle = {color:0xb8cfff,noiseSmall:100,noiseBig:500}
//failed
// async function shaderMat(){
//     const meshVert = await fetch("shaders/roamMeshVert.glsl").then(r=>r.text())
//     const meshFrag = await fetch("shaders/roamMeshFrag.glsl").then(r=>r.text())
//     let groundMeshSizes = {size:5000,subdivs:100}
//     const matGround = new THREE.ShaderMaterial({
//         vertexShader: meshVert,
//         fragmentShader: meshFrag,
//     })
    
//     const groundGeo = new THREE.PlaneGeometry(groundMeshSizes.size,groundMeshSizes.size,groundMeshSizes.subdivs,groundMeshSizes.subdivs)
//     groundGeo.computeTangents() //calculate tangents for normal
//     let groundMesh = new THREE.Mesh(groundGeo,matGround)
//     groundMesh.rotation.x = -Math.PI/2
//     groundMesh.position.y = -100
//     scene.add(groundMesh)
//     console.log(groundMesh.geometry.attributes.position.array)
// }
// shaderMat()
const noise = new Noise(0.3)
for (let i=0;i<GMS.subdivs+1;i++){
    let points = []
    for (let k=0;k<GMS.subdivs+1;k++){
        let a = -GMS.size/2+i*GMS.size/GMS.subdivs
        let b = -GMS.size/2+k*GMS.size/GMS.subdivs
        let vec3 = new THREE.Vector3(a,noise.perlin2(a/GMStyle.noiseBig,b/GMStyle.noiseBig)*80+noise.simplex2(a/GMStyle.noiseSmall,b/GMStyle.noiseSmall)*10-150,b)
        points.push(vec3)
    }
    const lngeo = new LineGeometry()
    const lnmat = new LineMaterial({color:GMStyle.color,linewidth:2})
    lngeo.setFromPoints(points)
    // lngeo.fromLine(ln)
    const ln2 = new Line2(lngeo,lnmat)
    scene.add(ln2)
}
for (let i=0;i<GMS.subdivs+1;i++){
    let points = []
    for (let k=0;k<GMS.subdivs+1;k++){
        let a = -GMS.size/2+k*GMS.size/GMS.subdivs
        let b = -GMS.size/2+i*GMS.size/GMS.subdivs
        let vec3 = new THREE.Vector3(a,noise.perlin2(a/GMStyle.noiseBig,b/GMStyle.noiseBig)*80+noise.simplex2(a/GMStyle.noiseSmall,b/GMStyle.noiseSmall)*10-150,b)
        points.push(vec3)
    }
    const lngeo = new LineGeometry()
    const lnmat = new LineMaterial({color:GMStyle.color,linewidth:2})
    lngeo.setFromPoints(points)
    // lngeo.fromLine(ln)
    const ln2 = new Line2(lngeo,lnmat)
    scene.add(ln2)
}



//mat
const mat = new THREE.MeshStandardMaterial({color:0xdddddd})
mat.roughness = 0.6
const matBl = new THREE.MeshStandardMaterial({color:0x000000})
matBl.roughness = 0.2
const matPaper = new THREE.MeshStandardMaterial({color:0xeeeeee})
matPaper.roughness = 0.9
const matEmi = new THREE.MeshStandardMaterial({color:0xade5f7,emissive:0xade5f7,emissiveIntensity:100})

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
        let yCoord = rho*Math.sin(theta)/sceneFlatness-50
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
        case "text":
        case "textImage":
            if (dataForRender[i].style.modelType==="model1"){
                createBook(contentCoord[i],dataForRender[i])
            } else {
                createEnvelope(contentCoord[i],dataForRender[i])
            }
            break
        case "audio":
            createVinyl(contentCoord[i],dataForRender[i])
            let audio = new Audio("uploads/"+dataForRender[i].fileUrl[0])
            audioArr.push({audio,coord:contentCoord[i],play:false})
            break
        case "link":
            createPortal(contentCoord[i],dataForRender[i])
            break
        case "model":
            createModel(contentCoord[i],dataForRender[i])
            break
    }
}



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
            tex.repeat.set(1/ratio, 1)
        } else {
            tex.repeat.set(1, ratio)
        }
    })
    grpPhotoFrame.position.copy(coord)
    grpPhotoFrame.rotation.y = Math.random()*Math.PI*2
    grpPhotoFrame.rotation.x = Math.random()*Math.PI/6-Math.PI/12
    scene.add(grpPhotoFrame)
}

//vinyl
function createVinyl(coord,data){
    const grpVinyl = new THREE.Group()
    objLoader.load("3Dassets/vinylRim.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matBl
        obj.scale.set(0.05,0.05,0.05)
        grpVinyl.add(obj)
    })
    objLoader.load("3Dassets/vinylLabel.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(0.05,0.05,0.05)
        grpVinyl.add(obj)
    })
    grpVinyl.position.copy(coord)
    grpVinyl.rotation.y = Math.random()*Math.PI*2
    grpVinyl.rotation.x = Math.random()*Math.PI-Math.PI/2
    scene.add(grpVinyl)
}

function createBook(coord,data){
    const grpBook = new THREE.Group()
    let mat = new THREE.MeshStandardMaterial({color:new THREE.Color(data.style.color),roughness:1-data.style.shininess/100})
    let scale = 0.05
    objLoader.load("3Dassets/bookCover.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grpBook.add(obj)
    })
    objLoader.load("3Dassets/bookPaper.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matPaper
        obj.scale.set(scale,scale,scale)
        grpBook.add(obj)
    })
    grpBook.position.copy(coord)
    grpBook.rotation.y = Math.random()*Math.PI*2
    grpBook.rotation.x = Math.random()*Math.PI-Math.PI/2
    scene.add(grpBook)
}

function createEnvelope(coord,data){
    const grpEnvelope = new THREE.Group()
    let mat = new THREE.MeshStandardMaterial({color:new THREE.Color(data.style.color),roughness:1-data.style.shininess/100})
    let scale = 0.05
    objLoader.load("3Dassets/envelope.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grpEnvelope.add(obj)
    })
    grpEnvelope.position.copy(coord)
    grpEnvelope.rotation.y = Math.random()*Math.PI*2
    grpEnvelope.rotation.x = Math.random()*Math.PI-Math.PI/2
    scene.add(grpEnvelope)
}

function createPortal(coord,data){
    const grpPortal = new THREE.Group()
    let scale = 0.05
    objLoader.load("3Dassets/portal.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grpPortal.add(obj)
    })
    objLoader.load("3Dassets/portalLight.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matEmi
        obj.scale.set(scale,scale,scale)
        grpPortal.add(obj)
    })
    grpPortal.position.copy(coord)
    grpPortal.rotation.y = Math.random()*Math.PI*2
    grpPortal.rotation.x = Math.random()*Math.PI/3-Math.PI/6
    scene.add(grpPortal)
}

function createModel(coord,data){
    const grpModel = new THREE.Group()
    let scale = 0.05
    objLoader.load("uploads/"+data.fileUrl[0],obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grpModel.add(obj)
    })
    grpModel.position.copy(coord)
    grpModel.rotation.y = Math.random()*Math.PI*2
    grpModel.rotation.x = Math.random()*Math.PI-Math.PI/2
    scene.add(grpModel)
}

//postprocessing
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(scrnSize.w,scrnSize.h)
effectComposer.setPixelRatio(window.devicePixelRatio)
const renderPass = new RenderPass(scene, cam)
const unrealBloomPass = new UnrealBloomPass()
const outputPass = new OutputPass()
unrealBloomPass.strength = 0.43
unrealBloomPass.radius = 0.3
unrealBloomPass.threshold = 0.45
effectComposer.addPass(renderPass)
effectComposer.addPass(unrealBloomPass)
effectComposer.addPass(outputPass)

//tick
const clock = new THREE.Clock()
const tick = ()=>{
    camctrl.update(clock.getDelta())
    for (let i=0;i<contentCoord.length;i++){  //proximity check for interaction
        if (cam.position.distanceTo(contentCoord[i])<interactionDist){
            nearestObj = dataForRender[i]
            if (nearestObj.type==="audio"){
                roamHUDCenter.textContent = ""
            } else if (nearestObj.type==="link"){
                roamHUDCenter.textContent = "[Q]Add to Collection  [E]Go to: "+nearestObj.text
            } else {
                roamHUDCenter.textContent = "[Q]Add to Collection  [E]View"
            }
            roamHUDCenter.style.display = "block"
            break
        } else {
            nearestObj = ""
            roamHUDCenter.style.display = "none"
        }
    }
    for (let i=0;i<audioArr.length;i++){  //proximity check for sound
        if (cam.position.distanceTo(audioArr[i].coord)<audioPlayDist){
            if (audioArr[i].play === false){
                audioArr[i].audio.play()
                audioArr[i].play = true
            } else {
                audioArr[i].audio.volume = (1-cam.position.distanceTo(audioArr[i].coord)/audioPlayDist)*0.7
            }
        } else {
            audioArr[i].play = false
            audioArr[i].audio.pause()
        }
    }
    effectComposer.render(scene,cam)
    window.requestAnimationFrame(tick)
}
tick()