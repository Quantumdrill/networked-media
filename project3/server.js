const express = require("express")

const app = express()
app.set("view engine","ejs")
app.use(express.static("static"))

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})

app.get("/posts",(req,res)=>{
    res.render("posts.ejs")
})

app.post("/submit",(req,res)=>{
    res.redirect("/posts")
})

app.listen(8080,()=>{
    console.log("http://127.0.0.1:8080")
})