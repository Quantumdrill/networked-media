const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")

const encodedParser = bodyParser.urlencoded({extended:true})
const uploadProcessor = multer({dest:"static/upload"})
const app = express()
app.set("view engine","ejs")
app.use(express.static("static"))
app.use(encodedParser)
let DataArray = []
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
    if (req.query.city) {
        DataArray = DataArray.filter(post=>post.city===req.query.city.replace("%20", " "))
    }
    res.render("posts.ejs", {allPost:DataArray})
})

app.post("/submit", uploadProcessor.array("wpFile"), (req,res)=>{
    let now = new Date()
    let post={
        title: req.body.wpTitle,
        city: req.body.wpCity,
        name: req.body.wpName,
        content: req.body.wpContent,
        date: now.toLocaleString(),
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
    res.redirect("/pigeon-posts")
})

app.get("/view-post", (req,res)=>{
    let currentIndex = Number(req.query.index)
    post = DataArray.find(post=>post.index===currentIndex)
    res.render("postView.ejs", {allPost:DataArray,post:post})
})

app.listen(8080,()=>{
    console.log("http://127.0.0.1:8080")
})