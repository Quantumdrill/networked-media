const express = require("express") //import express
const parser = require("body-parser") //import body-parser
const multer = require("multer")

const app = express() //create an instance of the express library
const encodedParser = parser.urlencoded({extended:true}) //change setting of the parser and the multer
const uploadProcesser = multer({dest: "public/upload"}) // the files will be stored in the "public/upload" directory

app.use(express.static("public")) //serves all files in the "public" folder
app.use(encodedParser)

app.set("view engine", "ejs") //set the HTML view engine to ejs
let messages = []

app.get("/",(req,res)=>{ //set up routes, after the "/" is NAME_OF_ROUTE, "/" is default route
    const data={messages_property:messages} //set up the messages array as an object because the res.render method only takes objects
    res.render("home.ejs",data)
})
app.get("/form",(req,res)=>{
    res.render("form.ejs")
})
app.post("/submit", uploadProcessor("image"), (req,res)=>{ //handles data from the form
    // messages.push({
    //     user: req.query.username,
    //     color: req.query.color
    // })
    console.log(req.body)
    res.redirect('/') //redirects back to the home page after data is processed
})

app.listen(5555,()=>{
    console.log("server is live at http://127.0.0.1:5555")
})