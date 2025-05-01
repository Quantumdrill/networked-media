let homeClicked = false
let aboutPage = false
document.addEventListener("click",()=>{
    if (homeClicked === false){
        let tl = gsap.timeline()
        tl.to("#hmHContainer",{opacity:0, duration:1})
        tl.to("#hmOptionsContainer",{opacity:1, duration:1})
        gsap.to(cam,{fov:40, duration:2, ease:"power1.inOut"})
        homeClicked = true
    }
})
hmAbout.addEventListener("click",()=>{
    aboutPage = true
    gsap.to("#hmOptionsContainer",{opacity:0, duration:1})
    gsap.to(cam,{fov:70, duration:2, ease:"power1.inOut"})
    let tl = gsap.timeline()
    tl.to(cam.rotation,{x:-1, duration:2, ease:"power1.inOut"})
    tl.set(hmAboutContainer,{display:"flex", duration:1},"-=0.5")
    tl.to(hmAboutContainer,{opacity:1, duration:1},"-=0.5")
})

hmAboutReturn.addEventListener("click",()=>{
    let tl = gsap.timeline()
    gsap.to(hmAboutContainer,{opacity:0, duration:1})
    gsap.set(hmAboutContainer,{display:"none", duration:1,delay:1})
    tl.to(cam.rotation,{x:0.1, duration:2, ease:"power1.inOut"})
    tl.to(cam,{fov:40, duration:2, ease:"power1.inOut"},"<")
    tl.to("#hmOptionsContainer",{opacity:1, duration:1,onComplete:()=>aboutPage=false})
})

//threejs part
import * as THREE from "three"
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import CustomShaderMaterial from 'https://cdn.jsdelivr.net/npm/three-custom-shader-material@6.3.5/vanilla/+esm'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

//initialize
const scene = new THREE.Scene()
const canvas = document.getElementById("hmCanvas")
const scrnSize = {w:window.innerWidth,h:window.innerHeight}
const renderer = new THREE.WebGLRenderer({canvas})
renderer.shadowMap.enabled = true
renderer.setSize(scrnSize.w,scrnSize.h)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
const cam = new THREE.PerspectiveCamera(60, scrnSize.w/scrnSize.h)
cam.rotation.order = "YXZ"
cam.position.y = -120
cam.rotation.x = 0.1
cam.rotation.y = Math.PI/2
cam.far = 3000
scene.add(cam)
window.addEventListener("resize",()=>{
    // camctrl.handleResize()
    scrnSize.w = window.innerWidth
    scrnSize.h = window.innerHeight
    cam.aspect = scrnSize.w/scrnSize.h
    cam.updateProjectionMatrix()
    renderer.setSize(scrnSize.w,scrnSize.h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    effectComposer.setSize(scrnSize.w,scrnSize.h)
    effectComposer.setPixelRatio(window.devicePixelRatio)
})

//loaders
const objLoader = new OBJLoader()
const texLoader = new THREE.TextureLoader()

//custom variables
let movementSpeed = 100

//mouse controls
document.addEventListener("mousemove", e=>{
    if (aboutPage===false){
        let xOffset = e.clientX-window.innerWidth/2
        let yOffset = e.clientY-window.innerHeight/2
        cam.rotation.y = -Math.PI/2 - xOffset/10000
        cam.rotation.x = 0.1 - yOffset/20000
    }
})

//lighting
texLoader.load("hdri_bg.png",tex=>{
    tex.colorSpace = THREE.SRGBColorSpace
    tex.mapping = THREE.EquirectangularReflectionMapping
    scene.background = tex
    scene.backgroundIntensity = 1.1
})
texLoader.load("hdri_refl.png",tex=>{
    tex.colorSpace = THREE.SRGBColorSpace
    tex.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = tex
    scene.environmentIntensity = 1.2
})

//ground shaders
let matGround
async function shaderMat(){
    const waterVert = await fetch("shaders/homeWaterVert.glsl").then(r=>r.text())
    const waterFrag = await fetch("shaders/homeWaterFrag.glsl").then(r=>r.text())
    let groundMeshSizes = {size:3000,subdivs:500}
    matGround = new CustomShaderMaterial({
        baseMaterial: THREE.MeshPhysicalMaterial,
        vertexShader: waterVert,
        fragmentShader: waterFrag,
        uniforms:{
            uTime:new THREE.Uniform(0.0),
        },
        metalness: 0.9,
        roughness: 0.01
    })
    
    const groundGeo = new THREE.PlaneGeometry(groundMeshSizes.size,groundMeshSizes.size,groundMeshSizes.subdivs,groundMeshSizes.subdivs)
    groundGeo.computeTangents() //calculate tangents for normal
    let groundMesh = new THREE.Mesh(groundGeo,matGround)
    groundMesh.rotation.x = -Math.PI/2
    groundMesh.position.y = -200
    groundMesh.position.x = 1000
    groundMesh.scale.y = 1.5
    scene.add(groundMesh)
}
shaderMat()

//postprocessing
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(scrnSize.w,scrnSize.h)
effectComposer.setPixelRatio(window.devicePixelRatio)
const renderPass = new RenderPass(scene, cam)
const bokehPass = new BokehPass(scene, cam, {
    focus: 0,
    aperture: 1.025,
    maxblur: 0.01
})
const unrealBloomPass = new UnrealBloomPass()
const outputPass = new OutputPass()
unrealBloomPass.strength = 0.43
unrealBloomPass.radius = 1.4
unrealBloomPass.threshold = 0.45
effectComposer.addPass(renderPass)
effectComposer.addPass(bokehPass)
effectComposer.addPass(unrealBloomPass)
effectComposer.addPass(outputPass)

//tick
const clock = new THREE.Clock()
const tick = () =>{
    // camctrl.update(clock.getDelta())
    cam.updateProjectionMatrix()
    if(matGround!==undefined){matGround.uniforms.uTime.value = clock.getElapsedTime()}
    effectComposer.render(scene,cam)
    window.requestAnimationFrame(tick)
}
tick()