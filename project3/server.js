const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")

const encodedParser = bodyParser.urlencoded({extended:true})
const uploadProcessor = multer({dest:"static/upload"})
const app = express()
app.set("view engine","ejs")
app.use(express.static("static"))
app.use(encodedParser)
app.use(express.json())
let DataArray = []
let filteredDataArrayDisp
let DataArrayDisp
let currentCity
let index = 0;

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/about-this-website",(req,res)=>{
    res.render("aboutWeb.ejs")
})

app.get("/contact-and-links",(req,res)=>{
    res.render("contact.ejs")
})

app.get("/about-pigeons",(req,res)=>{
    res.render("aboutPigeons.ejs")
})

app.get("/pigeons-in-the-world",(req,res)=>{
    res.render("map.ejs")
})

app.get("/pigeon-stories",(req,res)=>{
    DataArrayDisp = JSON.parse(fs.readFileSync("DataArray.json"))
    if (req.query.city) {
        let cityWithSpace = req.query.city.replace("%20", " ")
        cityWithSpace = req.query.city.replace("+", " ")
        filteredDataArrayDisp = DataArrayDisp.filter(post=>post.city===cityWithSpace)
        currentCity = cityWithSpace
    } else {
        filteredDataArrayDisp = DataArrayDisp
        currentCity = ""
    }
    res.render("posts.ejs", {allPost:filteredDataArrayDisp,currentCity:currentCity})
})

app.post("/submit", uploadProcessor.array("wpFile"), (req,res)=>{
    DataArray = JSON.parse(fs.readFileSync("DataArray.json"))
    let now = new Date()
    let post={
        title: req.body.wpTitle,
        city: req.body.wpCity,
        name: req.body.wpName,
        content: req.body.wpContent,
        date: new Intl.DateTimeFormat("en-GB",{
            hour12: false,
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(now),
        index: index,
    }
    index += 1;
    if (req.files){
        let filesArr = []
        for (let i=0;i<req.files.length;i++){
            filesArr.push(req.files[i].filename)
        }
        post.imgUrl = filesArr
    } else {
        post.imgUrl = "noImage"
    }
    
    DataArray.unshift(post)
    fs.writeFileSync("DataArray.json",JSON.stringify(DataArray))
    res.redirect("/pigeon-stories")
})

app.get("/view-post", (req,res)=>{
    DataArrayDisp = JSON.parse(fs.readFileSync("DataArray.json"))
    let currentIndex = Number(req.query.index)
    let post = DataArrayDisp.find(post=>post.index===currentIndex)
    res.render("postView.ejs", {post:post})
})

app.get("/edit-post", (req,res)=>{
    res.render("postsEdit.ejs")
})

app.get("/edit-post-submit", (req,res)=>{
    DataArray = JSON.parse(fs.readFileSync("DataArray.json"))
    let currentIndex = Number(req.query.removeIndex)
    DataArray = DataArray.filter(post => post.index !== currentIndex)
    fs.writeFileSync("DataArray.json",JSON.stringify(DataArray))
    res.redirect("/edit-post")
})

app.listen(8080,()=>{
    console.log("http://127.0.0.1:8080")
})