const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")

//setting the app
const app = express()
const encodedParser = bodyParser.urlencoded({extended:true})
const uploadProcessor = multer({dest:"public/upload"})

app.use(express.static("public"))
app.use(encodedParser) //allows the express to parse the body of the request (req.body)
app.set("view engine", "ejs")
let DataArr = []

app.get("/",(req,res)=>{
    res.render('index.ejs', {allPost:DataArr})
})

app.post("/upload", uploadProcessor.single("image"), (req,res)=>{
    let now = new Date()
    // local temporary post obj that determins the structure of each element in the array
    let post={
        text: req.body.text,
        date: now.toLocaleString()
    }
    //check for if file exists
    if (req.file){
        post.imgUrl = "upload/"+req.file.filename
    }
    // adds element to an array from the beginning
    DataArr.unshift(post)
    // redirect to home page
    res.redirect("/")
})

app.listen(5678,()=>{
    console.log("http://127.0.0.1:5678")
})