let fileType
let modelType = "model1"
let shininess = 40
let color = "#dddddd"
upFileTypes.addEventListener("change",e=>{
    fileType = e.target.value
    updateModel()
    switch (e.target.value){
        case "image":
            upH2TextFile.textContent = "Upload Image"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            upTextArea.placeholder = "Write your text here"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "none"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Photo frame"
            break;
        case "text":
            upH2TextFile.textContent = "Enter text"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "none"
            upTextArea.placeholder = "Write your text here"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "block"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Book"
            radioTitleModel2.textContent = "Envelope"
            break;
        case "audio":
            upH2TextFile.textContent = "Upload Audio"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "none"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Vinyl"
            break;
        case "video":
            upH2TextFile.textContent = "Not supported yet"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "none"
            radioLabelModel1.style.display = "none"
            radioLabelModel2.style.display = "none"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Photo frame"
            break;
        case "link":
            upH2TextFile.textContent = "Enter link"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "none"
            upTextArea.placeholder = "Paste your link here"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "none"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Portal"
            break;
        case "model":
            upH2TextFile.textContent = "Upload 3D model (.OBJ Only)"
            upTextArea.style.display = "none"
            upFileUpload.style.display = "block"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "none"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Model"
            break;
        case "textImage":
            upH2TextFile.textContent = "Write text and Upload Image"
            upTextArea.style.display = "block"
            upFileUpload.style.display = "block"
            upTextArea.placeholder = "Write your text here"
            radioLabelModel1.style.display = "block"
            radioLabelModel2.style.display = "block"
            radioLabelModel3.style.display = "none"
            radioTitleModel1.textContent = "Book"
            radioTitleModel2.textContent = "Envelope"
            break;
    }
})
upModelTypes.addEventListener("change",e=>{
    modelType = e.target.value
    updateModel()
})
sliderShininess.addEventListener("change",e=>{
    shininess = e.target.value
    updateMat()
})
colorPicker.addEventListener("change",e=>{
    color = e.target.value
    updateMat()
})

upFileUpload.addEventListener("change",e=>{
    Object.keys(upFileUpload.files).forEach((key)=>{
        const fileSize = upFileUpload.files[key] ? upFileUpload.files[key].size : 0
        if (upFileUpload.files[key].size > 10 * 1024 * 1024){
            alert("File must be under 10 MB") 
            upFileUpload.value = ""
        }
    })
})

let menuOn = false
let escMenu = document.getElementsByClassName("escMenu")
document.addEventListener("keyup",(e)=>{
    if (e.key==="Escape") {
        toggleMenu()
    }
})
function toggleMenu(){
    if (menuOn === false){
        Array.from(escMenu).forEach(elem=>{elem.style.display="flex"})
        menuOn = true
    } else {
        Array.from(escMenu).forEach(elem=>{elem.style.display="none"})
        menuOn = false
    }
}




//threejs preview

import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

//initialize
const scene = new THREE.Scene()
const canvas = document.getElementById("upCanvas")
const scrnSize = {w:upCanvas.offsetWidth,h:upCanvas.offsetHeight}
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true
renderer.setSize(scrnSize.w,scrnSize.h)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
const cam = new THREE.PerspectiveCamera(60, scrnSize.w/scrnSize.h)
cam.position.z = -30
scene.add(cam)
window.addEventListener("resize",()=>{
    scrnSize.w = upCanvas.offsetWidth
    scrnSize.h = upCanvas.offsetHeight
    cam.aspect = scrnSize.w/scrnSize.h
    cam.updateProjectionMatrix()
    renderer.setSize(scrnSize.w,scrnSize.h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
const fileReader = new FileReader();

//loaders
const objLoader = new OBJLoader()
const texLoader = new THREE.TextureLoader()

//camera control
const camctrl = new OrbitControls(cam,canvas)
scene.add(camctrl)

//lighting
const lt1 = new THREE.DirectionalLight(new THREE.Color(0xdddddd), 4)
const lt2 = new THREE.DirectionalLight(new THREE.Color(0xdddddd), 4)
const ltAmb = new THREE.AmbientLight(new THREE.Color(0xdddddd), 0.21)
lt1.position.x = -10
lt1.position.z = 3
lt1.position.y = 5
lt1.castShadow = true
lt2.position.x = 10
lt2.position.z = -3
lt2.position.y = -5
lt2.castShadow = true
scene.add(lt1, lt2)
scene.add(ltAmb)


//mat
const mat = new THREE.MeshStandardMaterial({color:0xdddddd})
mat.roughness = 0.6
const matBl = new THREE.MeshStandardMaterial({color:0x000000})
matBl.roughness = 0.2
const matPaper = new THREE.MeshStandardMaterial({color:0xeeeeee})
matPaper.roughness = 0.9
const matEmi = new THREE.MeshStandardMaterial({color:0xade5f7,emissive:0xade5f7,emissiveIntensity:100})

//update preview
let grp = new THREE.Group()
function updateModel (){
    if (grp.children){grp.children=[]}//clearing the group before switching to a new model
    if (file){updateFile(file)}
    switch (fileType){
        case "image":
            createPhotoFrame()
            break
        case "text":
        case "textImage":
            if (modelType==="model1"){
                createBook()
            } else {
                createEnvelope()
            }
            break
        case "audio":
            createVinyl()
            break
        case "link":
            createPortal()
            break
        case "model":
            createModel()
            break
    }
}
function updateMat(){
    mat.roughness = 1-shininess/100
    mat.color = new THREE.Color(color)
}

//photoframe
function createPhotoFrame(photo){
    // 
    if (photo){
        texLoader.load(photo,tex=>{
            tex.center.set(0.5, 0.5)
            let ratio = tex.image.width/tex.image.height/(4/3)
            objLoader.load("3Dassets/photoframe.obj",obj=>{
                obj.receiveShadow = true
                obj.castShadow = true
                obj.children[0].material = mat
                obj.scale.set(0.05,0.05,0.05)
                grp.add(obj)
            })
            objLoader.load("3Dassets/photoframePhoto.obj",obj=>{
                obj.receiveShadow = true
                obj.castShadow = true
                const mat = new THREE.MeshPhongMaterial({map:tex})
                obj.children[0].material = mat
                obj.scale.set(0.05,0.05,0.05)
                grp.add(obj)
            })
            if (tex.image.width/tex.image.height<1){
                tex.rotation = Math.PI/2
                ratio = tex.image.width/tex.image.height/(3/4)
                grp.rotation.z = -Math.PI/2
            }
            if (ratio>1){
                tex.repeat.set(1/ratio, 1)
            } else {
                tex.repeat.set(1, ratio)
            }
        })  
        grp.rotation.y = Math.PI
        scene.add(grp)
    } else {
        objLoader.load("3Dassets/photoframe.obj",obj=>{
            obj.receiveShadow = true
            obj.castShadow = true
            obj.children[0].material = mat
            obj.scale.set(0.05,0.05,0.05)
            grp.add(obj)
        })
        objLoader.load("3Dassets/photoframePhoto.obj",obj=>{
            obj.receiveShadow = true
            obj.castShadow = true
            obj.children[0].material = mat
            obj.scale.set(0.05,0.05,0.05)
            grp.add(obj)
        })
        grp.rotation.y = Math.PI
        scene.add(grp)
    }
}

//vinyl
function createVinyl(data){
    objLoader.load("3Dassets/vinylRim.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matBl
        obj.scale.set(0.05,0.05,0.05)
        grp.add(obj)
    })
    objLoader.load("3Dassets/vinylLabel.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(0.05,0.05,0.05)
        grp.add(obj)
    })
    scene.add(grp)
}

function createBook(data){
    let scale = 0.05
    objLoader.load("3Dassets/bookCover.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
    })
    objLoader.load("3Dassets/bookPaper.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matPaper
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
    })
    scene.add(grp)
}

function createEnvelope(data){
    let scale = 0.05
    objLoader.load("3Dassets/envelope.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
    })
    scene.add(grp)
}

function createPortal(data){
    let scale = 0.05
    objLoader.load("3Dassets/portal.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
    })
    objLoader.load("3Dassets/portalLight.obj",obj=>{
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = matEmi
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
    })
    scene.add(grp)
}


function createModel(model){
    let scale = 0.05
    if (model){
        const obj = objLoader.parse(model)
        obj.receiveShadow = true
        obj.castShadow = true
        obj.children[0].material = mat
        obj.scale.set(scale,scale,scale)
        grp.add(obj)
        scene.add(grp)
    }
}

// models involved with files
let file
upFileUpload.addEventListener("change",e=>{
    if (grp.children){grp.children=[]}
    file = e.target.files[0]
    updateFile(file)
})
function updateFile(e){
    if(fileType==="model"&&file){
        fileReader.onload = (read) => {
            createModel(read.target.result)
        }
        fileReader.readAsText(file);
    } else if (fileType==="image"&&file){
        fileReader.onload = (read) => {
            createPhotoFrame(read.target.result)
        }
        fileReader.readAsDataURL(file);    
    }
}

//tick
const clock = new THREE.Clock()
const tick = ()=>{
    camctrl.update(clock.getDelta())
    renderer.render(scene,cam)
    window.requestAnimationFrame(tick)
}
tick()